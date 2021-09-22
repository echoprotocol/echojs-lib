import { StructSerializer, VectorSerializer } from '../../collections';
import { integers, StringSerializer } from '../../basic';
import { uint32, uint64, uint8 } from '../../basic/integers';
import { sha256 } from '../../chain';

declare const prevOut: StructSerializer<{
	tx_id: typeof sha256,
	index: typeof uint32,
	amount: typeof uint64,
}>;

export const BtcTransactionDetailsSerializer: StructSerializer<{
	block_number: integers.UInt64Serializer,
	tx_id: StringSerializer,
	value: integers.UInt64Serializer,
	vout: integers.UInt32Serializer,
}>;

declare const script: VectorSerializer<typeof uint8>;
declare const wintess: VectorSerializer<VectorSerializer<typeof uint8>>;

declare const txIn: StructSerializer<{
	outpoint: typeof prevOut,
	unlock_script: typeof script,
	witness: typeof wintess,
	sequence: typeof uint32,
}>;

declare const p2shPwsh: StringSerializer;

declare const txOut: StructSerializer<{
	amount: typeof uint64,
	index: typeof uint32,
	lock_script: typeof script,
	address: typeof p2shPwsh,
}>;

declare const txIns: VectorSerializer<typeof txIn>;
declare const txOuts: VectorSerializer<typeof txOut>;

export const sidechainBtcTransaction: StructSerializer<{
	version: typeof uint32,
	marker: typeof uint8,
	flag: typeof uint8,
	inputs: typeof txIns,
	tx_outs: typeof txOuts,
	nlocktime: typeof uint32,
}>;
