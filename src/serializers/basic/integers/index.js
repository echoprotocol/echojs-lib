import Int64Serializer from './Int64';
import VarInt32Serializer from './VarInt32';

export const int64 = new Int64Serializer();
export const varint32 = new VarInt32Serializer();

export { Int64Serializer, VarInt32Serializer };
