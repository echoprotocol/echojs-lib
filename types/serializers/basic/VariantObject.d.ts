import ISerializer from "../ISerializer";

type TInput = [string, any];
type TOutput = [string, any];

export default class VariantObjectSerializer extends ISerializer<TInput, TOutput> {
    toRaw(value: TInput): TOutput;
    appendToByteBuffer(): void;
    readFromBuffer(buffer: Buffer, offset?: number): { res: [string, any]; newOffset: number };
}
