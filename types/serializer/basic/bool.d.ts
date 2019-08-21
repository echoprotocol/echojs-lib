import * as ByteBuffer from "bytebuffer";
import Serializable from "../serializable";

export class BoolType extends Serializable<boolean, boolean> {
	appendToByteBuffer(value: boolean, bytebuffer: ByteBuffer): void;
	toRaw(value: boolean): boolean;
}

declare const bool: BoolType;
export default bool;
