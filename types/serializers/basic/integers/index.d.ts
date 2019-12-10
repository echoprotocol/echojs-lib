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

export declare const int32: Int32Serializer;
export declare const int64: Int64Serializer;
export declare const uint8: UInt8Serializer;
export declare const uint16: UInt16Serializer;
export declare const uint32: UInt32Serializer;
export declare const uint64: UInt64Serializer;
export declare const uint256: UInt256Serializer;
export declare const varint32: VarInt32Serializer;

export {
	IIntSerializer,
	Int32Serializer,
	Int64Serializer,
	IUIntSerializer,
	UInt8Serializer,
	UInt16Serializer,
	UInt32Serializer,
	UInt64Serializer,
	UInt256Serializer,
	VarInt32Serializer,
};
