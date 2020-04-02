import IIntSerializer from './IIntSerializer';
import Int32Serializer from './Int32';
import Int64Serializer from './Int64';
import IUIntSerializer from './IUIntSerializer';
import UInt8Serializer from './UInt8';
import UInt16Serializer from './UInt16';
import UInt32Serializer from './UInt32';
import UInt64Serializer from './UInt64';
import UInt256Serializer from './UInt256';
import VarInt32Serializer from './VarInt32';

export const int32 = new Int32Serializer();
export const int64 = new Int64Serializer();
export const uint8 = new UInt8Serializer();
export const uint16 = new UInt16Serializer();
export const uint32 = new UInt32Serializer();
export const uint64 = new UInt64Serializer();
export const uint256 = new UInt256Serializer();
export const varint32 = new VarInt32Serializer();

export {
	IIntSerializer,
	Int32Serializer,
	Int64Serializer,
	IUIntSerializer,
	UInt8Serializer,
	UInt16Serializer,
	UInt32Serializer,
	UInt64Serializer,
	VarInt32Serializer,
	UInt256Serializer,
};
