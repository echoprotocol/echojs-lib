import { StringSerializer, BytesSerializer } from "./basic";
import { uint8, uint64, uint256 } from "./basic/integers";
import { StructSerializer, VectorSerializer } from "./collections";
import { sha256 } from "./chain";

declare const logEntry: StructSerializer<{
	address: BytesSerializer,
	data: BytesSerializer,
	topics: VectorSerializer<typeof sha256>,
	logIndex: StringSerializer,
}>;

export const evmTransactionReceipt: StructSerializer<{
	type: typeof uint8,
	transactionHash: typeof sha256,
	transactionIndex: typeof uint64,
	cumulativeGasUsed: typeof uint256,
	logs: VectorSerializer<typeof logEntry>,
	logsBloom: BytesSerializer,
	status: typeof uint8,
}>;
