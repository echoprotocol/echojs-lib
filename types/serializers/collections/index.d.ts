import MapSerializer from "./Map";
import OptionalSerializer from "./Optional";
import SetSerializer from "./Set";
import StaticVariantSerializer, { Variants } from "./StaticVariant";
import StructSerializer, { SerializersMap } from "./Struct";
import VectorSerializer from "./Vector";
import ISerializer from "../ISerializer";

export const map: <TKey extends ISerializer, TValue extends ISerializer>(
	keySerializer: TKey,
	valueSerializer: TValue,
) => MapSerializer<TKey, TValue>;

export const optional: <T extends ISerializer>(serializer: T) => OptionalSerializer<T>;
export const set: <T extends ISerializer>(serializer: T) => SetSerializer<T>;
export const staticVariant: <T extends Variants>(serializers: T) => StaticVariantSerializer<T>;
export const struct: <T extends SerializersMap>(serializers: T) => StructSerializer<T>;
export const vector: <T extends ISerializer>(serializer: T) => VectorSerializer<T>;

export {
	MapSerializer,
	OptionalSerializer,
	SetSerializer,
	StaticVariantSerializer,
	StructSerializer,
	VectorSerializer,
};
