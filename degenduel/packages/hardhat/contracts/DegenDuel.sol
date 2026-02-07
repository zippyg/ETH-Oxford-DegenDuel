// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { TestFtsoV2Interface } from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";
import { ContractRegistry } from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import { RandomNumberV2Interface } from "@flarenetwork/flare-periphery-contracts/coston2/RandomNumberV2Interface.sol";
import { IFdcVerification } from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
import { IWeb2Json } from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";

/**
 * @title DegenDuel
 * @notice PvP prediction duel game using all 3 Flare protocols: FTSO + FDC + RNG
 * @dev Built for ETH Oxford 2026 hackathon on Coston2 testnet
 */
contract DegenDuel {
    // ============ Types ============

    enum DuelType { PRICE, DATA }
    enum DuelStatus { OPEN, ACTIVE, SETTLED, CANCELLED, EXPIRED }

    struct Duel {
        uint256 id;
        DuelType duelType;
        DuelStatus status;
        address playerA;
        address playerB;
        uint256 stakeAmount;
        uint256 deadline;
        bool playerAPrediction; // true = "above threshold"
        address winner;
        // PRICE duel fields
        bytes21 feedId;
        uint256 priceThreshold;
        int8 priceDecimals;
        // DATA duel fields (settled via FDC Web2Json)
        uint256 dataThreshold;
        // Settlement data
        uint256 settledValue;
        uint256 payout;
        bool bonusApplied;
    }

    // ============ State ============

    uint256 public nextDuelId;
    mapping(uint256 => Duel) public duels;
    uint256[] public openDuelIds;
    uint256[] public activeDuelIds;
    mapping(address => uint256[]) public playerDuels;
    mapping(address => uint256) public playerWins;
    mapping(address => uint256) public playerEarnings;

    uint256 public constant PROTOCOL_FEE_BPS = 100; // 1%
    uint256 public constant BONUS_CHANCE = 10; // 10% chance of 2x via RNG
    uint256 public constant MIN_STAKE = 0.01 ether;
    uint256 public constant MAX_DURATION = 7 days;

    address public immutable owner;
    uint256 public protocolFeePool;
    uint256 public totalDuelsCreated;
    uint256 public totalDuelsSettled;
    uint256 public totalVolume;

    // ============ Events ============

    event DuelCreated(
        uint256 indexed duelId,
        address indexed creator,
        DuelType duelType,
        uint256 stakeAmount,
        uint256 deadline,
        bytes21 feedId,
        uint256 threshold,
        bool prediction
    );

    event DuelJoined(uint256 indexed duelId, address indexed joiner);

    event DuelSettled(
        uint256 indexed duelId,
        address indexed winner,
        uint256 payout,
        uint256 settledValue,
        bool bonusApplied
    );

    event DuelCancelled(uint256 indexed duelId);
    event DuelExpired(uint256 indexed duelId);

    event PriceRead(
        uint256 indexed duelId,
        bytes21 feedId,
        uint256 value,
        int8 decimals,
        uint64 timestamp
    );

    event BonusTriggered(uint256 indexed duelId, uint256 randomNumber);

    // ============ Constructor ============

    constructor() {
        owner = msg.sender;
    }

    // ============ Duel Creation ============

    /// @notice Create a price-based duel settled by FTSO
    function createPriceDuel(
        bytes21 feedId,
        uint256 priceThreshold,
        int8 priceDecimals,
        uint256 deadline,
        bool prediction
    ) external payable returns (uint256 duelId) {
        require(msg.value >= MIN_STAKE, "Stake too low");
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(deadline <= block.timestamp + MAX_DURATION, "Deadline too far");

        duelId = nextDuelId++;
        Duel storage d = duels[duelId];
        d.id = duelId;
        d.duelType = DuelType.PRICE;
        d.status = DuelStatus.OPEN;
        d.playerA = msg.sender;
        d.stakeAmount = msg.value;
        d.deadline = deadline;
        d.playerAPrediction = prediction;
        d.feedId = feedId;
        d.priceThreshold = priceThreshold;
        d.priceDecimals = priceDecimals;

        openDuelIds.push(duelId);
        playerDuels[msg.sender].push(duelId);
        totalDuelsCreated++;

        emit DuelCreated(duelId, msg.sender, DuelType.PRICE, msg.value, deadline, feedId, priceThreshold, prediction);
    }

    /// @notice Create a data-based duel settled by FDC Web2Json proof
    function createDataDuel(
        uint256 dataThreshold,
        uint256 deadline,
        bool prediction
    ) external payable returns (uint256 duelId) {
        require(msg.value >= MIN_STAKE, "Stake too low");
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(deadline <= block.timestamp + MAX_DURATION, "Deadline too far");

        duelId = nextDuelId++;
        Duel storage d = duels[duelId];
        d.id = duelId;
        d.duelType = DuelType.DATA;
        d.status = DuelStatus.OPEN;
        d.playerA = msg.sender;
        d.stakeAmount = msg.value;
        d.deadline = deadline;
        d.playerAPrediction = prediction;
        d.dataThreshold = dataThreshold;

        openDuelIds.push(duelId);
        playerDuels[msg.sender].push(duelId);
        totalDuelsCreated++;

        emit DuelCreated(duelId, msg.sender, DuelType.DATA, msg.value, deadline, bytes21(0), dataThreshold, prediction);
    }

    // ============ Duel Joining ============

    /// @notice Join an open duel (takes the opposite prediction)
    function joinDuel(uint256 duelId) external payable {
        Duel storage d = duels[duelId];
        require(d.status == DuelStatus.OPEN, "Duel not open");
        require(msg.sender != d.playerA, "Cannot join own duel");
        require(msg.value == d.stakeAmount, "Must match stake");
        require(block.timestamp < d.deadline, "Duel expired");

        d.playerB = msg.sender;
        d.status = DuelStatus.ACTIVE;

        _removeFromOpenDuels(duelId);
        activeDuelIds.push(duelId);
        playerDuels[msg.sender].push(duelId);
        totalVolume += d.stakeAmount * 2;

        emit DuelJoined(duelId, msg.sender);
    }

    // ============ Settlement ============

    /// @notice Settle a price duel by reading current FTSO price
    function settlePriceDuel(uint256 duelId) external {
        Duel storage d = duels[duelId];
        require(d.status == DuelStatus.ACTIVE, "Duel not active");
        require(d.duelType == DuelType.PRICE, "Not a price duel");
        require(block.timestamp >= d.deadline, "Too early to settle");

        // Read FTSO price
        TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
        (uint256 feedValue, int8 feedDecimals, uint64 feedTimestamp) = ftsoV2.getFeedById(d.feedId);

        emit PriceRead(duelId, d.feedId, feedValue, feedDecimals, feedTimestamp);

        // Normalize both values to same decimal scale for comparison
        uint256 normalizedFeed = _normalize(feedValue, feedDecimals);
        uint256 normalizedThreshold = _normalize(d.priceThreshold, d.priceDecimals);

        bool conditionMet = normalizedFeed >= normalizedThreshold;
        d.settledValue = feedValue;

        _settleDuel(d, conditionMet);
    }

    /// @notice Settle a data duel with a verified FDC Web2Json proof
    function settleDataDuel(
        uint256 duelId,
        IWeb2Json.Proof calldata proof
    ) external {
        Duel storage d = duels[duelId];
        require(d.status == DuelStatus.ACTIVE, "Duel not active");
        require(d.duelType == DuelType.DATA, "Not a data duel");
        require(block.timestamp >= d.deadline, "Too early to settle");

        // Verify the FDC proof
        IFdcVerification fdcVerification = ContractRegistry.getFdcVerification();
        require(fdcVerification.verifyWeb2Json(proof), "Invalid FDC proof");

        // Decode the attested value (expecting a single uint256 named "value")
        uint256 attestedValue = abi.decode(proof.data.responseBody.abiEncodedData, (uint256));
        d.settledValue = attestedValue;

        bool conditionMet = attestedValue >= d.dataThreshold;
        _settleDuel(d, conditionMet);
    }

    // ============ Cancellation / Expiry ============

    /// @notice Cancel an open duel (creator only, before anyone joins)
    function cancelDuel(uint256 duelId) external {
        Duel storage d = duels[duelId];
        require(d.status == DuelStatus.OPEN, "Duel not open");
        require(msg.sender == d.playerA, "Only creator can cancel");

        d.status = DuelStatus.CANCELLED;
        _removeFromOpenDuels(duelId);

        // Refund creator
        payable(d.playerA).transfer(d.stakeAmount);

        emit DuelCancelled(duelId);
    }

    /// @notice Expire a duel that passed deadline + 24h without settlement
    function expireDuel(uint256 duelId) external {
        Duel storage d = duels[duelId];
        require(d.status == DuelStatus.ACTIVE, "Duel not active");
        require(block.timestamp > d.deadline + 1 days, "Grace period not over");

        d.status = DuelStatus.EXPIRED;
        _removeFromActiveDuels(duelId);

        // Refund both players
        payable(d.playerA).transfer(d.stakeAmount);
        payable(d.playerB).transfer(d.stakeAmount);

        emit DuelExpired(duelId);
    }

    // ============ View Functions ============

    /// @notice Get current FTSO price for a feed (for UI display)
    function getCurrentPrice(bytes21 feedId)
        external view returns (uint256 value, int8 decimals, uint64 timestamp)
    {
        TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
        return ftsoV2.getFeedById(feedId);
    }

    /// @notice Get multiple FTSO prices at once (for UI ticker)
    function getPrices(bytes21[] calldata feedIds)
        external view returns (uint256[] memory values, int8[] memory decimals, uint64 timestamp)
    {
        TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
        return ftsoV2.getFeedsById(feedIds);
    }

    /// @notice Get a random number from Flare's Secure RNG
    function getRandomNumber()
        external view returns (uint256 randomNumber, bool isSecure, uint256 randomTimestamp)
    {
        RandomNumberV2Interface rng = ContractRegistry.getRandomNumberV2();
        return rng.getRandomNumber();
    }

    /// @notice Get a single duel by ID
    function getDuel(uint256 duelId) external view returns (Duel memory) {
        return duels[duelId];
    }

    /// @notice Get all open duels
    function getOpenDuels() external view returns (Duel[] memory) {
        Duel[] memory result = new Duel[](openDuelIds.length);
        for (uint256 i = 0; i < openDuelIds.length; i++) {
            result[i] = duels[openDuelIds[i]];
        }
        return result;
    }

    /// @notice Get all active duels
    function getActiveDuels() external view returns (Duel[] memory) {
        Duel[] memory result = new Duel[](activeDuelIds.length);
        for (uint256 i = 0; i < activeDuelIds.length; i++) {
            result[i] = duels[activeDuelIds[i]];
        }
        return result;
    }

    /// @notice Get duels for a specific player
    function getPlayerDuels(address player) external view returns (Duel[] memory) {
        uint256[] memory ids = playerDuels[player];
        Duel[] memory result = new Duel[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = duels[ids[i]];
        }
        return result;
    }

    /// @notice Get player stats for leaderboard
    function getPlayerStats(address player)
        external view returns (uint256 wins, uint256 earnings)
    {
        return (playerWins[player], playerEarnings[player]);
    }

    /// @notice Get protocol stats
    function getProtocolStats()
        external view returns (uint256 created, uint256 settled, uint256 volume, uint256 fees)
    {
        return (totalDuelsCreated, totalDuelsSettled, totalVolume, protocolFeePool);
    }

    // ============ Admin ============

    /// @notice Withdraw accumulated protocol fees
    function withdrawFees() external {
        require(msg.sender == owner, "Only owner");
        uint256 amount = protocolFeePool;
        protocolFeePool = 0;
        payable(owner).transfer(amount);
    }

    // ============ Internal ============

    function _settleDuel(Duel storage d, bool conditionMet) internal {
        // Determine winner
        // playerA predicted conditionMet (prediction = true means "above")
        // playerB automatically took the opposite
        address winner;
        if (conditionMet == d.playerAPrediction) {
            winner = d.playerA;
        } else {
            winner = d.playerB;
        }

        uint256 totalPot = d.stakeAmount * 2;
        uint256 fee = (totalPot * PROTOCOL_FEE_BPS) / 10000;
        uint256 winnerPayout = totalPot - fee;
        bool bonusApplied = false;

        // RNG bonus check (10% chance of 2x — fee is waived for bonus)
        try ContractRegistry.getRandomNumberV2().getRandomNumber() returns (
            uint256 randomNumber, bool isSecure, uint256
        ) {
            if (isSecure && (randomNumber % 100) < BONUS_CHANCE) {
                // Bonus! Winner gets full pot (no fee taken)
                winnerPayout = totalPot;
                fee = 0;
                bonusApplied = true;
                emit BonusTriggered(d.id, randomNumber);
            }
        } catch {
            // RNG failed, proceed without bonus
        }

        d.winner = winner;
        d.status = DuelStatus.SETTLED;
        d.payout = winnerPayout;
        d.bonusApplied = bonusApplied;
        protocolFeePool += fee;
        totalDuelsSettled++;

        playerWins[winner]++;
        playerEarnings[winner] += winnerPayout;

        _removeFromActiveDuels(d.id);

        // Transfer winnings
        payable(winner).transfer(winnerPayout);

        emit DuelSettled(d.id, winner, winnerPayout, d.settledValue, bonusApplied);
    }

    /// @notice Normalize a value to 18 decimals for comparison
    function _normalize(uint256 value, int8 decimals) internal pure returns (uint256) {
        if (decimals >= 0) {
            uint8 d = uint8(int8(18) - decimals);
            return value * (10 ** d);
        } else {
            uint8 d = uint8(int8(18) + (-decimals));
            return value * (10 ** d);
        }
    }

    function _removeFromOpenDuels(uint256 duelId) internal {
        for (uint256 i = 0; i < openDuelIds.length; i++) {
            if (openDuelIds[i] == duelId) {
                openDuelIds[i] = openDuelIds[openDuelIds.length - 1];
                openDuelIds.pop();
                return;
            }
        }
    }

    function _removeFromActiveDuels(uint256 duelId) internal {
        for (uint256 i = 0; i < activeDuelIds.length; i++) {
            if (activeDuelIds[i] == duelId) {
                activeDuelIds[i] = activeDuelIds[activeDuelIds.length - 1];
                activeDuelIds.pop();
                return;
            }
        }
    }

    receive() external payable {}
}
