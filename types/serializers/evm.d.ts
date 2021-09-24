import { StringSerializer, BytesSerializer } from "./basic";
import { uint8, uint64, uint256 } from "./basic/integers";
import { StructSerializer, VectorSerializer, staticVariant, StaticVariantSerializer } from "./collections";
import { sha256 } from "./chain";

declare const logEntry: StructSerializer<{
	log_index: StringSerializer,
	address: BytesSerializer,
	data: BytesSerializer,
	topics: VectorSerializer<typeof sha256>,
}>;

export const evmTransactionReceipt: StructSerializer<{
	type: typeof uint8,
	transaction_hash: typeof sha256,
	transaction_index: typeof uint64,
	cumulative_gas_used: typeof uint256,
	logs: VectorSerializer<typeof logEntry>,
	logs_bloom: BytesSerializer,
	status_or_root: StaticVariantSerializer<[typeof uint8, typeof sha256]>,
}>;
