import Type from '../type';

class OptionalType extends Type {

	/**
	 * @readonly
	 * @type {Type}
	 */
	get type() { return this._type; }

	/** @param {Type} type */
	constructor(type) {
		super();
		if (!(type instanceof Type)) throw new Error('property "type" is not a instance of Type class');
		/**
		 * @private
		 * @type {Type}
		 */
		this._type = type;
	}

	validate(value) {
		if (value === undefined) return;
		this.type.validate(value);
	}

	// TODO: implement

}

/**
 * @param {Type} type
 * @returns {OptionalType}
 */
export default function optional(type) { return new OptionalType(type); }
