import ChainApi from "../interfaces/ChainApi";
import WsStatus from "../interfaces/WsStatus";

export const CONNECTION_TIMEOUT: number;
export const MAX_RETRIES: number;
export const PING_TIMEOUT: number;
export const PING_DELAY: number;
export const DEBUG: number;

export { ChainApi as CHAIN_API };

export const CHAIN_APIS: ChainApi[];
export const DEFAULT_CHAIN_APIS: ChainApi[];

export const STATUS: typeof WsStatus;
