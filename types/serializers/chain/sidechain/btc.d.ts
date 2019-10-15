import { StructSerializer } from '../../collections';
import { integers, StringSerializer } from '../../basic';

export const BtcTransactionDetailsSerializer: StructSerializer<{
	block_number: integers.UInt64Serializer,
	tx_id: StringSerializer,
	value: integers.UInt64Serializer,
	vout: integers.UInt32Serializer,
}>;
