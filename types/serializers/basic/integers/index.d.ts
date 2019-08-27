import IIntSerializer from "./IIntSerializer";
import Int64Serializer from "./Int64";
import IUIntSerializer from "./IUIntSerializer";
import UInt8Serializer from "./UInt8";
import UInt16Serializer from "./UInt16";
import UInt32Serializer from "./UInt32";
import VarInt32Serializer from "./VarInt32";

export declare const int64: Int64Serializer;
export declare const uint8: UInt8Serializer;
export declare const uint16: UInt16Serializer;
export declare const uint32: UInt32Serializer;
export declare const varint32: VarInt32Serializer;

export {
	IIntSerializer,
	Int64Serializer,
	IUIntSerializer,
	UInt8Serializer,
	UInt16Serializer,
	UInt32Serializer,
	VarInt32Serializer,
};
