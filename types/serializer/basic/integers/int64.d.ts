import * as ByteBuffer from "bytebuffer";
import IntType from "./int";

export class Int64Type extends IntType<string> {
	appendToByteBuffer(value: Parameters<Int64Type['toRaw']>[0], bytebuffer: ByteBuffer): void;
}

declare const int64: Int64Type;
export default int64;
