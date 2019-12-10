export enum LogType {
	EVM = 0,
	X86_X64 = 1,
}

export interface LogEntry {
	address: string;
	log: string[];
	data: string;
	block_num: number;
	trx_num: number;
	op_num: number;
}

export type Log = [LogType, LogEntry];
