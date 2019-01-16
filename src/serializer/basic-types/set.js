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

	/**
	 * @param {undefined|Array<*>|Set<*>} value
	 * @returns {Set<*>}
	 */
	validate(value) {
		value = toSet(value);
		for (const element of value) this.type.validate(element);
		return value;
	}

	/**
	 * @param {undefined|Array<*>|Set<*>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		value = this.validate(value);
		bytebuffer.writeVarint32(value.size);
		for (const element of value) this.type.appendToByteBuffer(element, bytebuffer);
	}

	/**
	 * @param {undefined|Array<*>|Set<*>} value
	 * @returns {Array<*>}
	 */
	toObject(value) { return [...this.validate(value)].map((element) => this.type.toObject(element)); }

}

/**
 * @param {Type} type
 * @returns {SetType}
 */
export default (type) => new SetType(type);
