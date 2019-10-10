import IUIntSerializer from "./IUIntSerializer";
import { SerializerInput } from "../../ISerializer";

export default class UInt256Serializer extends IUIntSerializer<string> {
    appendToByteBuffer(value: SerializerInput<UInt256Serializer>): void;
}
