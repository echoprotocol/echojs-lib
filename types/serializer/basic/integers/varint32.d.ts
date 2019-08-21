import * as ByteBuffer from "bytebuffer";
import IntType from "./int";

export class Varint32Type extends IntType<number> {
	appendToByteBuffer(value: Parameters<Varint32Type['toRaw']>[0], bytebuffer: ByteBuffer): void;
}

declare const varint32: Varint32Type;
export default varint32;
