import ISerializer, { SerializerInput } from "../ISerializer";

type TInput = Array<any>;
type TOutput = Array<any>;

export default class VariantObjectSerializer extends ISerializer<TInput, TOutput> {
    toRaw(value: TInput): TOutput;
    appendToByteBuffer(): void;
}
