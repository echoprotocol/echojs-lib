import * as ByteBuffer from "bytebuffer";
import UIntType from "./uint";

export class UInt64Type extends UIntType<string> {
	appendToByteBuffer(value: Parameters<UInt64Type['toRaw']>[0], bytebuffer: ByteBuffer): void;
}

declare const uint64: UInt64Type;
export default uint64;
