import StaticVariantSerializer, { Variants } from "./StaticVariant";
import StructSerializer, { SerializersMap } from "./Struct";

export const staticVariant: <T extends Variants>(serializers: T) => StaticVariantSerializer<T>;
export const struct: <T extends SerializersMap>(serializers: T) => StructSerializer<T>;

export { StaticVariantSerializer, StructSerializer };
