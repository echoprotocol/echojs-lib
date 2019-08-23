import IIntSerializer from './IIntSerializer';
import Int64Serializer from './Int64';
import IUIntSerializer from './IUIntSerializer';
import UInt16Serializer from './UInt16';
import UInt32Serializer from './UInt32';
import VarInt32Serializer from './VarInt32';

export const int64 = new Int64Serializer();
export const uint16 = new UInt16Serializer();
export const uint32 = new UInt32Serializer();
export const varint32 = new VarInt32Serializer();

export { IIntSerializer, Int64Serializer, IUIntSerializer, UInt16Serializer, UInt32Serializer, VarInt32Serializer };
