import ISerializer, { SerializerInput, SerializerOutput } from "../ISerializer";

type TInput<T extends ISerializer, K extends ISerializer> = [SerializerInput<T>, SerializerInput<K>];
type TOutput<T extends ISerializer, K extends ISerializer> = [SerializerOutput<T>, SerializerOutput<K>];


export default class PairSerializer<TFirstSerializer extends ISerializer, TSecondSerializer extends ISerializer> extends ISerializer<
  TInput<TFirstSerializer, TSecondSerializer>,
  TOutput<TFirstSerializer, TSecondSerializer>
  > {
  readonly firstSerializer: TFirstSerializer;
  readonly secondSerializer: TSecondSerializer;
  constructor(firstSerializer: TFirstSerializer, secondSerializer: TSecondSerializer);
  toRaw(value: TInput<TFirstSerializer, TSecondSerializer>): TOutput<TFirstSerializer, TSecondSerializer>;
  appendToByteBuffer(value: TInput<TFirstSerializer, TSecondSerializer>, bytebuffer: ByteBuffer): void;
  readFromBuffer(buffer: Buffer, offset?: number): { res: TOutput<TFirstSerializer, TSecondSerializer>, newOffset: number };
}
