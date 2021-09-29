import { StringSerializer } from "./basic";
import { uint8, uint64, uint32 } from "./basic/integers";
import { StructSerializer, VectorSerializer } from "./collections";

declare const logEntry: StructSerializer<{
	address: StringSerializer,
	log: VectorSerializer<StringSerializer>,
	data: StringSerializer,
	block_num: typeof uint32,
	trx_num: typeof uint32,
	op_num: typeof uint32,
}>;

export const evmTransactionReceipt: StructSerializer<{
	status_code: typeof uint8,
	gas_used: typeof uint64,
	bloom: StringSerializer,
	log: VectorSerializer<typeof logEntry>,
}>;
