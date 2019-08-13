import Type from '../type';
import { validateUnsignedSafeInteger } from '../../utils/validators';

/** @typedef {{[key:number]:Type}|Array<Type>} _StaticVariantSubType */

class StaticVariantType extends Type {

	/**
	 * @description readonly is used for outscope. it used as non-readonly in operations.js to avoid looping
	 * @readonly
	 * @type {_StaticVariantSubType}
	 */
	get types() { return { ...this._types }; }

	/** @param {_StaticVariantSubType} types */
	set types(types) {
		if (!types || typeof types !== 'object') throw new Error('types variable is not an object');
		if (Array.isArray(types)) types = { ...types };
		for (const key in types) {
			if (!Object.prototype.hasOwnProperty.call(types, key)) continue;
			const num = Number.parseInt(key, 10);
			validateUnsignedSafeInteger(num, `key ${key}`);
			const operation = types[key];
			if (!(operation instanceof Type)) {
				throw new Error(`variant with key ${key} is not a instance op Type class`);
			}
		}
		/**
		 * @private
		 * @type {_StaticVariantSubType}
		 */
		this._types = { ...types };
	}

	/** @param {_StaticVariantSubType} types */
	constructor(types) {
		super();
		this.types = types;
	}

	/** @typedef {number} _VariantId */

	/** @param {[_VariantId,any]} value */
	validate(value) {
		if (!Array.isArray(value)) throw new Error('value is not an array');
		const [key] = value;
		let [, variant] = value;
		const type = this.types[key];
		if (!type) throw new Error(`type with key ${key} not found`);
		try {
			variant = type.validate(variant);
		} catch (error) {
			throw new Error(`static variant: ${error.message}`);
		}
		return { key, type, variant };
	}

	/**
	 * @param {[_VariantId,any]} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const { key, type, variant } = this.validate(value);
		bytebuffer.writeVarint32(key);
		type.appendToByteBuffer(variant, bytebuffer);
	}

	/**
	 * @param {[_VariantId,*]} value
	 * @returns {[number,*]}
	 */
	toObject(value) {
		const { key, type, variant } = this.validate(value);
		return [key, type.toObject(variant)];
	}

}

/**
 * @param {_StaticVariantSubType} types
 * @returns {StaticVariantType}
 */
export default (types) => new StaticVariantType(types);
