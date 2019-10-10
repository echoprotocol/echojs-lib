import { struct } from '../../collections';
import { integers, string as stringSerializer } from '../../basic';

export const btcTransactionDetailsSerializer = struct({
	block_number: integers.uint64,
	tx_id: stringSerializer,
	value: integers.uint64,
	vout: integers.uint32,
});

export default { btcTransactionDetailsSerializer };
