export { FtsoService, FtsoServiceLive, FEED_IDS, type PriceData } from "./FtsoService";
export { FdcService, FdcServiceLive, type AttestationParams, type AttestationResult } from "./FdcService";
export { RngService, RngServiceLive, type RandomData } from "./RngService";
export { FlockService, FlockServiceLive, type StrategyHint } from "./FlockService";
export { EventService, EventServiceLive, type DuelEvent } from "./EventService";
export { DuelService, DuelServiceLive, type DuelPipelineState, type DuelProgress } from "./DuelService";
export { ConfigService, ConfigServiceLive, type AppConfig } from "./config";
export * from "./errors";

import { Layer } from "effect";
import { ConfigServiceLive } from "./config";
import { FtsoServiceLive } from "./FtsoService";
import { FdcServiceLive } from "./FdcService";
import { RngServiceLive } from "./RngService";
import { FlockServiceLive } from "./FlockService";
import { EventServiceLive } from "./EventService";
import { DuelServiceLive } from "./DuelService";

// Composed live layer providing all services
export const AppLayerLive = Layer.mergeAll(
  FtsoServiceLive,
  FdcServiceLive,
  RngServiceLive,
  FlockServiceLive,
  EventServiceLive,
  DuelServiceLive,
).pipe(Layer.provide(ConfigServiceLive));
