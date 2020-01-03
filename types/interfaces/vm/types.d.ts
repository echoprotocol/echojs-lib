import { VMType } from "../objects";

export interface LogEntry {
	address: string;
	log: string[];
	data: string;
	block_num: number;
	trx_num: number;
	op_num: number;
}

export type Log = [VMType, LogEntry];
