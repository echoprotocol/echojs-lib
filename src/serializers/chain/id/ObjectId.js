import { varint32, VarInt32Serializer } from '../../basic/integers';
import { RESERVED_SPACES, IMPLEMENTATION_OBJECT_TYPE } from '../../../constants/chain-types';
import { toId } from '../../../utils/converters';
import ISerializer from '../../ISerializer';

/** @typedef {import("../../../constants/chain-types").e_RESERVED_SPACES} e_RESERVED_SPACES */

/**
 * @template {e_RESERVED_SPACES} T
 * @typedef {{ [RESERVED_SPACES['RELATIVE_PROTOCOL_IDS']]: never, 1: string, [RESERVED_SPACES['IMPLEMENTATION_IDS']]: number }[T]} ObjectTypeId
 */

/** @type {e_RESERVED_SPACES['']} */
const a;

type ObjectTypeId<T extends RESERVED_SPACES> = {
	[RESERVED_SPACES.RELATIVE_PROTOCOL_IDS]: never;
	[RESERVED_SPACES.PROTOCOL_IDS]: OBJECT_TYPES;
	[RESERVED_SPACES.IMPLEMENTATION_IDS]: IMPLEMENTATION_OBJECT_TYPE;
}[T];


const objectIdPureRegexp = /^\d\.\d\.\d$/;

const _objectTypeIds = {
	[RESERVED_SPACES.RELATIVE_PROTOCOL_IDS]: {},
	[RESERVED_SPACES.PROTOCOL_IDS]: RESERVED_SPACES,
	[RESERVED_SPACES.IMPLEMENTATION_IDS]: IMPLEMENTATION_OBJECT_TYPE,
};

export default class ObjectIdSerializer extends ISerializer {

	/**
	 * @readonly
	 * @type {number}
	 */
	get reservedSpaceId() { return this._reservedSpaceId; }

	/**
	 * @readonly
	 * @type {number|Array<number>}
	 */
	get objectTypeIds() { return this._objectTypeIds; }

	/**
	 * @param {number} reservedSpaceId
	 * @param {number|Array<number>} objectTypeId
	 */
	constructor(reservedSpaceId, objectTypeIds) {
		if (!Object.values(RESERVED_SPACES).includes(reservedSpaceId)) throw new Error('invalid reserved space id');
		super();
		/**
		 * @private
		 * @type {number}
		 */
		this._reservedSpaceId = reservedSpaceId;
		if (!Array.isArray(objectTypeIds)) objectTypeIds = [objectTypeIds];
		for (const objectTypeId of objectTypeIds) {
			const availableObjectTypeIds = _objectTypeIds[this.reservedSpaceId];
			if (!Object.values(availableObjectTypeIds).includes(objectTypeId)) {
				throw new Error(`invalid object typeof id ${objectTypeId}`);
			}
		}
		/**
		 * @private
		 * @type {number}
		 */
		this._objectTypeIds = objectTypeIds;
	}

	/**
	 * @param {string|number} value
	 * @returns {string}
	 */
	toRaw(value) {
		if (typeof value === 'string' && objectIdPureRegexp.test(value)) {
			if (!objectIdPureRegexp.test(value)) throw new Error('invalid object id format');
			const [actualReservedSpaceIdString, actualObjectTypeIdString, actualInstanceIdString] = value.split('.');
			if (actualReservedSpaceIdString !== this.reservedSpaceId.toString()) {
				throw new Error('invalid reserved space id');
			}
			if (!this.objectTypeIds.some((objectTypeId) => actualObjectTypeIdString === objectTypeId.toString())) {
				throw new Error('invalid object type id');
			}
			value = actualInstanceIdString;
		}
		if (this.objectTypeIds.length !== 1) throw new Error('unable to automatically set object type id');
		/** @type {ReturnType<VarInt32Serializer['toRaw']>} */
		let rawInstanceId;
		try {
			rawInstanceId = varint32.toRaw(value);
		} catch (error) {
			throw new Error(`instance id: ${error.message}`);
		}
		return `${this.reservedSpaceId}.${this.objectTypeIds[0]}.${rawInstanceId}`;
	}

	/**
	 * @param {string|number} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		varint32.appendToByteBuffer(raw.split('.')[2], bytebuffer);
	}

}
