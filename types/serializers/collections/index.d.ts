import SetSerializer from "./Set";
import StaticVariantSerializer, { Variants } from "./StaticVariant";
import StructSerializer, { SerializersMap } from "./Struct";
import ISerializer from "../ISerializer";

export const set: <T extends ISerializer>(serializer: T) => SetSerializer<T>;
export const staticVariant: <T extends Variants>(serializers: T) => StaticVariantSerializer<T>;
export const struct: <T extends SerializersMap>(serializers: T) => StructSerializer<T>;

export { SetSerializer, StaticVariantSerializer, StructSerializer };
