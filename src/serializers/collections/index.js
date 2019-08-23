import StaticVariantSerializer from './StaticVariant';
import StructSerializer from './Struct';

/** @typedef {import("./StaticVariant").Variants} Variants */
/** @typedef {import("./Struct").SerializersMap} SerializersMap */

/**
 * @template {Variants} T
 * @param {T} serializers
 * @returns {StaticVariantSerializer<T>}
 */
export const staticVariant = (serializers) => new StaticVariantSerializer(serializers);

/**
 * @template {SerializersMap} T
 * @param {T} serializers
 * @returns {StructSerializer<T>}
 */
export const struct = (serializers) => new StructSerializer(serializers);

export { StaticVariantSerializer, StructSerializer };
