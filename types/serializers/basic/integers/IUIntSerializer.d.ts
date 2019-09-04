import IIntSerializer from "./IIntSerializer";
import { SerializerInput, SerializerOutput } from "../../ISerializer";

export default abstract class IUIntSerializer<T extends string | number> extends IIntSerializer<T> {
	constructor(bitsCount: number);
	toRaw(value: SerializerInput<IIntSerializer<T>>): SerializerOutput<IIntSerializer<T>>;
}
