import { string, bytes } from './basic';
import { uint64, uint8, uint256 } from './basic/integers';
import { struct, vector } from './collections';
import { sha256 } from './chain';

const logEntry = struct({
	address: bytes(),
	data: bytes(),
	topics: vector(sha256),
	logIndex: string,
});

export const evmTransactionReceipt = struct({
	type: uint8,
	transactionHash: sha256,
	transactionIndex: uint64,
	cumulativeGasUsed: uint256,
	logs: vector(logEntry),
	logsBloom: bytes(),
	status: uint8,
});

export default { evmTransactionReceipt };
