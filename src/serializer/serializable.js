import Type from './type';

class Serializable extends Type {

	/**
	 * @readonly
	 * @type {Object<string,Type>}
	 */
	get types() { return { ...this._types }; }

	/** @param {Object<string,Type>} types */
	constructor(types) {
		if (typeof types !== 'object' || types === null) throw new Error('property "types" is not a object');
		for (const key in types) {
			if (!Object.prototype.hasOwnProperty.call(types, key)) continue;
			const type = types[key];
			if (!(type instanceof Type)) throw new Error(`type of field "${key}" is not a instance of Type class`);
		}
		super();
		/**
		 * @private
		 * @type {Object<string,Type>}
		 */
		this._types = types;
	}

	/** @type {[key:string]:*} */
	validate(value) {
		for (const key in value) {
			if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
			if (!this.types[key]) throw new Error(`unknown property ${key}`);
		}
		for (const key in this.types) {
			if (!Object.prototype.hasOwnProperty.call(this.types, key)) continue;
			const type = this.types[key];
			type.validate(value[key]);
		}
	}

	/**
	 * @param {{[key:string]:*}} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		for (const key in this.types) {
			if (!Object.prototype.hasOwnProperty.call(this.types, key)) continue;
			const type = this.types[key];
			type.appendToByteBuffer(value[key], bytebuffer);
		}
	}

}

/**
 * @param {Object<string,Type>} types
 * @returns {Serializable}
 */
export default function serializable(types) { return new Serializable(types); }
export { Serializable };
