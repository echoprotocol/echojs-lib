import * as ByteBuffer from "bytebuffer";
import UIntType from "./uint";

export class UInt8Type extends UIntType<number> {
	appendToByteBuffer(value: Parameters<UInt8Type['toRaw']>[0], bytebuffer: ByteBuffer): void;
}

declare const uint8: UInt8Type;
export default uint8;
