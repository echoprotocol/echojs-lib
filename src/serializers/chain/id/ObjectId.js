import { varint32 } from '../../basic/integers';
import { RESERVED_SPACE_ID, IMPLEMENTATION_OBJECT_TYPE_ID } from '../../../constants/chain-types';
import ISerializer from '../../ISerializer';
import { PROTOCOL_OBJECT_TYPE_ID } from '../../../constants';

/** @typedef {import("bytebuffer")} ByteBuffer */

/**
 * @template {ISerializer} T
 * @typedef {import("../../ISerializer").SerializerInput<T>} SerializerInput
 */

/** @typedef {import("../../basic/integers").VarInt32Serializer} VarInt32Serializer */
/** @typedef {import("../../../constants").ProtocolObjectTypeId} ProtocolObjectTypeId */
/** @typedef {import("../../../constants/chain-types").ReservedSpaceId} ReservedSpaceId */
/** @typedef {import("../../../constants/chain-types").ImplementationObjectTypeId} ImplementationObjectTypeId */

/**
 * @template {ReservedSpaceId} T
 * @typedef {{ 0: never, 1: ProtocolObjectTypeId, 2: ImplementationObjectTypeId }[T]} ObjectTypeId
 */

/** @typedef {string | SerializerInput<VarInt32Serializer>} TInput */

const objectIdPureRegexp = /^\d+\.\d+\.\d+$/;

const _objectTypeIds = {
	[RESERVED_SPACE_ID.RELATIVE_PROTOCOL]: {},
	[RESERVED_SPACE_ID.PROTOCOL]: PROTOCOL_OBJECT_TYPE_ID,
	[RESERVED_SPACE_ID.IMPLEMENTATION]: IMPLEMENTATION_OBJECT_TYPE_ID,
};

/**
 * @template {ReservedSpaceId} T
 * @augments {ISerializer<TInput, string>}
 */
export default class ObjectIdSerializer extends ISerializer {

	/**
	 * @readonly
	 * @type {T}
	 */
	get reservedSpaceId() { return this._reservedSpaceId; }

	/**
	 * @readonly
	 * @type {ObjectTypeId<T>[]}
	 */
	get objectsTypesIds() { return this._objectsTypesIds; }

	/**
	 * @param {T} reservedSpaceId
	 * @param {ObjectTypeId<T> | ObjectTypeId<T>[]} objectsTypesIds
	 */
	constructor(reservedSpaceId, objectsTypesIds) {
		if (!Object.values(RESERVED_SPACE_ID).includes(reservedSpaceId)) throw new Error('invalid reserved space id');
		super();
		/**
		 * @private
		 * @type {T}
		 */
		this._reservedSpaceId = reservedSpaceId;
		if (!Array.isArray(objectsTypesIds)) objectsTypesIds = [objectsTypesIds];
		for (const objectTypeId of objectsTypesIds) {
			const availableObjectTypeIds = _objectTypeIds[this.reservedSpaceId];
			if (!Object.values(availableObjectTypeIds).includes(objectTypeId)) {
				throw new Error(`invalid object typeof id ${objectTypeId}`);
			}
		}
		/**
		 * @private
		 * @type {ObjectTypeId<T>[]}
		 */
		this._objectsTypesIds = objectsTypesIds;
	}

	/**
	 * @param {TInput} value
	 * @returns {string}
	 */
	toRaw(value) {
		if (typeof value === 'string') {
			if (!objectIdPureRegexp.test(value)) throw new Error('invalid object id format');
			const [actualReservedSpaceIdString, actualObjectTypeIdString, actualInstanceIdString] = value.split('.');
			if (actualReservedSpaceIdString !== this.reservedSpaceId.toString()) {
				throw new Error('invalid reserved space id');
			}
			if (!this.objectsTypesIds.some((objectTypeId) => actualObjectTypeIdString === objectTypeId.toString())) {
				throw new Error('invalid object type id');
			}
			value = actualInstanceIdString;
		}
		if (this.objectsTypesIds.length !== 1) throw new Error('unable to automatically set object type id');
		/** @type {ReturnType<VarInt32Serializer['toRaw']>} */
		let rawInstanceId;
		try {
			rawInstanceId = varint32.toRaw(value);
		} catch (error) {
			throw new Error(`instance id: ${error.message}`);
		}
		return `${this.reservedSpaceId}.${this.objectsTypesIds[0]}.${rawInstanceId}`;
	}

	/**
	 * @param {TInput} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		varint32.appendToByteBuffer(raw.split('.')[2], bytebuffer);
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: string, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const { res: instanceId, newOffset } = varint32.readFromBuffer(buffer, offset);
		return { res: this.toRaw(instanceId), newOffset };
	}

}
