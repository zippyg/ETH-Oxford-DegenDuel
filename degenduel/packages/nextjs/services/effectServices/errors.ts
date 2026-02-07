import { Data } from "effect";

export class FtsoError extends Data.TaggedError("FtsoError")<{
  readonly feedId: string;
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class FdcError extends Data.TaggedError("FdcError")<{
  readonly message: string;
  readonly step?: string;
  readonly cause?: unknown;
}> {}

export class FdcPrepareError extends Data.TaggedError("FdcPrepareError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class FdcSubmitError extends Data.TaggedError("FdcSubmitError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class FdcTimeoutError extends Data.TaggedError("FdcTimeoutError")<{
  readonly roundId: number;
  readonly message: string;
}> {}

export class FdcProofError extends Data.TaggedError("FdcProofError")<{
  readonly roundId: number;
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class ContractError extends Data.TaggedError("ContractError")<{
  readonly method: string;
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class RngError extends Data.TaggedError("RngError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class FlockError extends Data.TaggedError("FlockError")<{
  readonly message: string;
  readonly statusCode?: number;
  readonly cause?: unknown;
}> {}

export class ConfigError extends Data.TaggedError("ConfigError")<{
  readonly key: string;
  readonly message: string;
}> {}

export class EventError extends Data.TaggedError("EventError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export type AppError = FtsoError | FdcError | ContractError | RngError | FlockError | ConfigError | EventError;
