import * as ByteBuffer from "bytebuffer";
import Serializable from "../../serializable";

export class ObjectIdType extends Serializable<string, string> {
	toRaw(value: string): string;
	appendToByteBuffer(value: string, bytebuffer: ByteBuffer): void;
}

declare const objectId: ObjectIdType;
export default objectId;
