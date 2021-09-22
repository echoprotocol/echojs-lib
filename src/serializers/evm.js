import { string } from "./basic";
import { uint32, uint8 } from "./basic/integers";
import { struct, vector } from "./collections";

const logEntry = struct({
	address: string,
	log: vector(string),
	data: string,
	block_num: uint32,
	trx_num: uint32,
	op_num: uint32,
});

export const evmTransactionReceipt = struct({
	status_code: uint8,
	gas_used: uint64,
	bloom: string,
	log: vector(logEntry),
});
