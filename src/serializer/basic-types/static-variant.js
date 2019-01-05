import Type from '../type';

class StaticVariantType extends Type {

	/**
	 * @readonly
	 * @type {Array<Type>}
	 */
	get types() { return [...this._types]; }

	/** @param {Array<Type>} types */
	constructor(types) {
		if (!Array.isArray(types)) throw new Error('variants is not an array');
		for (let i = 0; i < types.length; i += 1) {
			if (!(types[i] instanceof Type)) throw new Error(`variant with index ${i} is not a instance of Type class`);
		}
		super();
		this._types = [...types];
	}

	validate() { super.validate(); }

	appendToByteBuffer() { super.appendToByteBuffer(); }

}

/**
 * @param {Array<Type>} types
 * @returns {StaticVariantType}
 */
export default (types) => new StaticVariantType(types);
