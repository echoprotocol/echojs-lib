import Serializable from '../../serializable';
import { toId } from '../../../utils/converters';
import { validateUnsignedSafeInteger } from '../../../utils/validators';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @typedef {string | number} TInput */

/** @augments {Serializable<TInput, string>} */
export class IdType extends Serializable {

	/**
	 * @readonly
	 * @type {number}
	 */
	get reservedSpaceId() { return this._reservedSpaceId; }

	/**
	 * @readonly
	 * @type {number | number[]}
	 */
	get objectTypeId() { return this._objectTypeId; }

	/**
	 * @param {number} reservedSpaceId
	 * @param {number | number[]} objectTypeId
	 */
	constructor(reservedSpaceId, objectTypeId) {
		super();
		validateUnsignedSafeInteger(reservedSpaceId);
		/**
		 * @private
		 * @type {number}
		 */
		this._reservedSpaceId = reservedSpaceId;
		if (typeof objectTypeId === 'number') validateUnsignedSafeInteger(objectTypeId);
		else if (!Array.isArray(objectTypeId)) throw new Error('objectTypeId is not a number or array of numbers');
		else {
			for (const objectIdSingleType of objectTypeId) validateUnsignedSafeInteger(objectIdSingleType);
		}
		/**
		 * @private
		 * @type {number | number[]}
		 */
		this._objectTypeId = objectTypeId;
	}

	/**
	 * @param {TInput} value
	 * @returns {number}
	 */
	toRaw(value) { return toId(value, this.reservedSpaceId, this.objectTypeId); }

	/**
	 * @param {TInput} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) { bytebuffer.writeVarint32(this.toId(value)); }

}

/**
 * @param {number} reservedSpaceId
 * @param {number | number[]} objectTypeId
 * @returns {IdType}
 */
export default function id(reservedSpaceId, objectTypeId) { return new IdType(reservedSpaceId, objectTypeId); }
