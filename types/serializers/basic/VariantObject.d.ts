import ISerializer, { SerializerInput } from "../ISerializer";

type TInput = [string, any];
type TOutput = [string, any];

export default class VariantObjectSerializer extends ISerializer<TInput, TOutput> {
    toRaw(value: TInput): TOutput;
    appendToByteBuffer(): void;
}
