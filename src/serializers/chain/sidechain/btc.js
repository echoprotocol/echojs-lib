import { struct } from '../../collections';
import { integers } from '../../basic';
import { sha256 } from '../../chain';

const prevOut = struct({
	tx_id: sha256,
	index: integers.uint32,
	amount: integers.uint64,
});

export const btcTransactionDetailsSerializer = struct({
	block_number: integers.uint64,
	out: prevOut,
});

export default { btcTransactionDetailsSerializer };
