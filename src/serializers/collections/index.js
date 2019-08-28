import MapSerializer from './Map';
import OptionalSerializer from './Optional';
import SetSerializer from './Set';
import StaticVariantSerializer from './StaticVariant';
import StructSerializer from './Struct';
import VectorSerializer from './Vector';

/** @typedef {import("../ISerializer").default} ISerializer */

/**
 * @template {ISerializer} TKey
 * @template {ISerializer} TValue
 * @param {TKey} keySerializer
 * @param {TValue} valueSerializer
 * @returns {MapSerializer<TKey, TValue>}
 */
export const map = (keySerializer, valueSerializer) => new MapSerializer(keySerializer, valueSerializer);

/**
 * @template {ISerializer} T
 * @param {T} serializer
 * @returns {OptionalSerializer<T>}
 */
export const optional = (serializer) => new OptionalSerializer(serializer);

/**
 * @template {ISerializer} T
 * @param {T} serializer
 * @returns {SetSerializer<T>}
 */
export const set = (serializer) => new SetSerializer(serializer);

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

/**
 * @template {ISerializer} T
 * @param {T} serializer
 * @returns {VectorSerializer<T>}
 */
export const vector = (serializer) => new VectorSerializer(serializer);

export {
	MapSerializer,
	OptionalSerializer,
	SetSerializer,
	StaticVariantSerializer,
	StructSerializer,
	VectorSerializer,
};
