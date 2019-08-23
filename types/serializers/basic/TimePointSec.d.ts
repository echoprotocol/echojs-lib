import { UInt32Serializer } from "./integers";
import { SerializerInput, SerializerOutput } from "../ISerializer";

export default class TimePointSecSerializer extends UInt32Serializer {
	toRaw(value: SerializerInput<UInt32Serializer> | Date): SerializerOutput<UInt32Serializer>;
}
