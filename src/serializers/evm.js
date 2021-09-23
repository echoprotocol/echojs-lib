import { string } from './basic';
import { uint64, uint8 } from './basic/integers';
import { struct, vector } from './collections';
import { sha256 } from './chain';

const logEntry = struct({
	address: string,
	data: string,
	topics: vector(string),
	logIndex: string,
});

export const evmTransactionReceipt = struct({
	type: uint8,
	transactionHash: sha256,
	transactionIndex: uint8,
	cumulativeGasUsed: uint64,
	logs: vector(logEntry),
	logsBloom: string,
	status: uint8,
});

export default { evmTransactionReceipt };
