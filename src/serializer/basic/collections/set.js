import Serializable from '../../serializable';

/**
 * @param {undefined|Array<*>|Set<*>} value
 * @returns {Array<*>}
 */
function toArray(value) {
	if (value === undefined) return [];
	if (Array.isArray(value)) return value;
	if (value instanceof Set) return Array.from(value);
	throw new Error('value is not a Set');
}

// TODO: jsdoc
class SetType extends Serializable {

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
	 * @returns {Array<*>}
	 */
	validate(value) {
		value = toArray(value);
		for (let i = 0; i < value.length; i += 1) {
			try {
				const element = value[i];
				this.type.validate(element);
			} catch (error) {
				throw new Error(`set element with index ${i}: ${error.message}`);
			}
		}
		return value;
	}

	/**
	 * @param {undefined|Array<*>|Set<*>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		value = this.validate(value);
		bytebuffer.writeVarint32(value.length);
		for (const element of value) this.type.appendToByteBuffer(element, bytebuffer);
	}

	/**
	 * @param {undefined|Array<*>|Set<*>} value
	 * @returns {Array<*>}
	 */
	toObject(value) { return this.validate(value).map((element) => this.type.toObject(element)); }

}

/**
 * @param {Type} type
 * @returns {SetType}
 */
export default (type) => new SetType(type);
