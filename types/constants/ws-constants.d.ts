export declare const CONNECTION_TIMEOUT: number;
export declare const MAX_RETRIES: number;
export declare const PING_TIMEOUT: number;
export declare const PING_INTERVAL: number;
export declare const DEBUG: boolean;
export declare const CHAIN_APIS: string[];
export declare const DEFAULT_CHAIN_APIS: string[];

export declare interface STATUS {
    OPEN: string,
    ERROR: string,
    CLOSE: string,
}

export interface WsConstants {
    CONNECTION_TIMEOUT: number,
    MAX_RETRIES: number,
    PING_TIMEOUT: number,
    PING_INTERVAL: number,
    DEBUG: boolean,
    CHAIN_APIS: string[],
    DEFAULT_CHAIN_APIS: string[],
    STATUS: STATUS,
}
