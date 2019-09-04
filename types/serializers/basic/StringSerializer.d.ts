import * as ByteBuffer from "bytebuffer";
import ISerializer from "../ISerializer";

export default class StringSerializer extends ISerializer<string, string> {
	toRaw(value: string): string;
	appendToByteBuffer(value: string, bytebuffer: ByteBuffer): void;
}
