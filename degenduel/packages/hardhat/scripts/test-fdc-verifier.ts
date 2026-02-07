/**
 * Test FDC Verifier Script
 * Quick test to verify FDC verifier endpoint is working
 * Does NOT submit on-chain - just validates Step 1 (prepareRequest)
 *
 * Usage:
 *   npx hardhat run scripts/test-fdc-verifier.ts
 *
 * Optional env vars:
 *   TEST_API_URL - API endpoint to test (default: Blockchain.info)
 *   TEST_API_JQ - JQ filter to test
 */

const VERIFIER_URL = "https://fdc-verifiers-testnet.flare.network";
const FDC_API_KEY = "00000000-0000-0000-0000-000000000000";

function toHex(s: string): string {
  let h = "";
  for (let i = 0; i < s.length; i++) {
    h += s.charCodeAt(i).toString(16);
  }
  return "0x" + h.padEnd(64, "0");
}

async function testVerifier(
  apiUrl: string,
  jqFilter: string,
  abiSignature: any
): Promise<boolean> {
  console.log(`\nTesting API: ${apiUrl}`);
  console.log(`JQ Filter: ${jqFilter}`);
  console.log();

  const attestationType = toHex("Web2Json");
  const sourceId = toHex("PublicWeb2");

  const requestBody = {
    url: apiUrl,
    httpMethod: "GET",
    headers: "{}",
    queryParams: "{}",
    body: "{}",
    postProcessJq: jqFilter,
    abiSignature: JSON.stringify(abiSignature),
  };

  const payload = {
    attestationType,
    sourceId,
    requestBody,
  };

  console.log("Calling FDC verifier...");

  try {
    const response = await fetch(`${VERIFIER_URL}/verifier/web2/Web2Json/prepareRequest`, {
      method: "POST",
      headers: {
        "X-API-KEY": FDC_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error response: ${errorText}`);
      return false;
    }

    const result = await response.json();
    console.log(`Response status: ${result.status}`);

    if (result.status === "VALID") {
      console.log("✓ Success! Attestation request is valid.");
      console.log(`ABI-encoded request length: ${result.abiEncodedRequest.length} chars`);
      console.log(`ABI-encoded request (first 100 chars): ${result.abiEncodedRequest.substring(0, 100)}...`);
      return true;
    } else {
      console.log(`❌ Invalid request: ${JSON.stringify(result)}`);
      return false;
    }
  } catch (error: any) {
    console.log(`❌ Network error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("\n=== FDC Verifier API Test ===");
  console.log(`Verifier endpoint: ${VERIFIER_URL}/verifier/web2/Web2Json/prepareRequest`);

  // Test configurations
  const tests = [
    {
      name: "Blockchain.info BTC (uint256)",
      url: "https://blockchain.info/ticker",
      jq: '{ value: .USD.last }',
      abi: {
        components: [{ internalType: "uint256", name: "value", type: "uint256" }],
        name: "task",
        type: "tuple",
      },
    },
    {
      name: "CryptoCompare ETH (uint256)",
      url: "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD",
      jq: '{ value: .USD }',
      abi: {
        components: [{ internalType: "uint256", name: "value", type: "uint256" }],
        name: "task",
        type: "tuple",
      },
    },
    {
      name: "Star Wars API (string)",
      url: "https://swapi.info/api/people/3",
      jq: '{ value: .name }',
      abi: {
        components: [{ internalType: "string", name: "value", type: "string" }],
        name: "task",
        type: "tuple",
      },
    },
  ];

  // Use custom config if provided
  const customUrl = process.env.TEST_API_URL;
  const customJq = process.env.TEST_API_JQ;

  if (customUrl && customJq) {
    console.log("\nUsing custom configuration from environment variables");
    const result = await testVerifier(customUrl, customJq, tests[0].abi);
    console.log();
    process.exit(result ? 0 : 1);
  }

  // Run all tests
  console.log("\nRunning tests for known-working APIs...\n");
  console.log("=".repeat(60));

  const results: { name: string; success: boolean }[] = [];

  for (const test of tests) {
    console.log(`\nTest: ${test.name}`);
    console.log("=".repeat(60));
    const success = await testVerifier(test.url, test.jq, test.abi);
    results.push({ name: test.name, success });
    console.log();
  }

  console.log("\n=== Test Summary ===");
  console.log();
  for (const result of results) {
    const status = result.success ? "✓ PASS" : "❌ FAIL";
    console.log(`${status}: ${result.name}`);
  }
  console.log();

  const allPassed = results.every(r => r.success);
  if (allPassed) {
    console.log("✓ All tests passed! FDC verifier is working correctly.");
  } else {
    console.log("⚠️  Some tests failed. Check the output above for details.");
  }

  process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
