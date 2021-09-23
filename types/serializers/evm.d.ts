import { StringSerializer, BytesSerializer } from "./basic";
import { uint8, uint64 } from "./basic/integers";
import { StructSerializer, VectorSerializer } from "./collections";
import { sha256 } from "./chain";

declare const logEntry: StructSerializer<{
	address: StringSerializer,
	data: StringSerializer,
	topics: VectorSerializer<StringSerializer>,
	logIndex: StringSerializer,
}>;

export const evmTransactionReceipt: StructSerializer<{
	type: typeof uint8,
	transactionHash: typeof sha256,
	transactionIndex: typeof uint8,
	cumulativeGasUsed: typeof uint64,
	logs: VectorSerializer<typeof logEntry>,
	logsBloom: StringSerializer,
	status: typeof uint8,
}>;
