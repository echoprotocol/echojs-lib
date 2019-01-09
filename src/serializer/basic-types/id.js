import Type from '../type';
import { toId } from '../../utils/converters';
import { validateUnsignedSafeInteger } from '../../utils/validators';

class IdType extends Type {

	/**
	 * @readonly
	 * @type {number}
	 */
	get reservedSpaceId() { return this._reservedSpaceId; }

	/**
	 * @readonly
	 * @type {number}
	 */
	get objectTypeId() { return this._objectTypeId; }

	constructor(reservedSpaceId, objectTypeId) {
		super();
		validateUnsignedSafeInteger(reservedSpaceId);
		/**
		 * @private
		 * @type {number}
		 */
		this._reservedSpaceId = reservedSpaceId;
		validateUnsignedSafeInteger(objectTypeId);
		/**
		 * @private
		 * @type {number}
		 */
		this._objectTypeId = objectTypeId;
	}

	/**
	 * @param {string|number} value
	 * @returns {number}
	 */
	toId(value) { return toId(value, this.reservedSpaceId, this.objectTypeId); }

	/** @param {string|number} value */
	validate(value) { this.toId(value); }

	/**
	 * @param {string|number} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		bytebuffer.writeVarint32(this.toId(value));
	}

	/**
	 * @param {string|number} value
	 * @returns {string}
	 */
	toObject(value) { return `${this.reservedSpaceId}.${this.objectTypeId}.${this.validate(value)}`; }

}

export default (reservedSpaceId, objectTypeId) => new IdType(reservedSpaceId, objectTypeId);
