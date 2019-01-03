import Type from '../type';

/**
 * @param {undefined|Array<*>|Set<*>} value
 * @returns {Set<*>}
 */
function toSet(value) {
	if (value === undefined) return new Set();
	if (Array.isArray(value)) return new Set(value);
	if (value instanceof Set) return value;
	throw new Error('value is not a Set');
}

class SetType extends Type {

	/**
	 * @readonly
	 * @type {Type}
	 */
	get type() { return this._type; }

	/** @param {Type} type */
	constructor(type) {
		super();
		/**
		 * @private
		 * @type {Type}
		 */
		this._type = type;
	}

	/** @param {undefined|Array<*>|Set<*>} value */
	validate(value) {
		value = toSet(value);
		for (const element of value) this.type.validate(element);
	}

	/**
	 * @param {undefined|Array<*>|Set<*>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		value = toSet(value);
		bytebuffer.writeVarint32(value.size);
		for (const element of value) this.type.appendToByteBuffer(element, bytebuffer);
	}

}

/**
 * @param {Type} type
 * @returns {SetType}
 */
export default function set(type) { return new SetType(type); }
