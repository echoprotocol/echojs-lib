import { string, bytes } from './basic';
import { uint64, uint8, uint256 } from './basic/integers';
import { struct, vector, staticVariant } from './collections';
import { sha256 } from './chain';

const logEntry = struct({
	log_index: string,
	address: bytes(),
	data: bytes(),
	topics: vector(sha256),
});

export const evmTransactionReceipt = struct({
	type: uint8,
	transaction_hash: sha256,
	transaction_index: uint64,
	cumulative_gas_used: uint256,
	logs: vector(logEntry),
	logs_bloom: bytes(),
	status_or_root: staticVariant([uint8, sha256]),
});

export default { evmTransactionReceipt };
