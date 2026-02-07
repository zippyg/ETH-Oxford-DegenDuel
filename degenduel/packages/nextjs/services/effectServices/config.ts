import { Context, Effect, Layer } from "effect";

export interface AppConfig {
  readonly chainId: number;
  readonly rpcUrl: string;
  readonly wsUrl: string;
  readonly contractAddress: string;
  readonly verifierUrl: string;
  readonly verifierApiKey: string;
  readonly daLayerUrl: string;
  readonly flockApiUrl: string;
  readonly flockApiKey: string;
}

export class ConfigService extends Context.Tag("ConfigService")<
  ConfigService,
  AppConfig
>() {}

export const ConfigServiceLive = Layer.succeed(ConfigService, {
  chainId: 114,
  rpcUrl: "https://coston2-api.flare.network/ext/C/rpc",
  wsUrl: "wss://coston2-api.flare.network/ext/C/ws",
  contractAddress: "0x835574875C1CB9003c1638E799f3d7c504808960",
  verifierUrl: "https://fdc-verifiers-testnet.flare.network/verifier/web2/Web2Json/prepareRequest",
  verifierApiKey: "00000000-0000-0000-0000-000000000000",
  daLayerUrl: "https://ctn2-data-availability.flare.network",
  flockApiUrl: "https://api.flock.io/v1/chat/completions",
  flockApiKey: process.env.NEXT_PUBLIC_FLOCK_API_KEY || "",
});
