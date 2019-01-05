import Type from '../type';

class MapType extends Type {

	/**
	 * @readonly
	 * @type {Type}
	 */
	get keyType() { return this._keyType; }

	/**
	 * @readonly
	 * @type {Type}
	 */
	get valueType() { return this._valueType; }

	/**
	 * @param {Type} keyType
	 * @param {Type} valueType
	 */
	constructor(keyType, valueType) {
		if (!(keyType instanceof Type)) throw new Error('keyType is not a instance of Type class');
		if (!(valueType instanceof Type)) throw new Error('valueType is not a instance of Type class');
		super();
		/**
		 * @private
		 * @type {Type}
		 */
		this._keyType = keyType;
		/**
		 * @private
		 * @type {Type}
		 */
		this._valueType = valueType;
	}

	validate() { super.validate(); }

	appendToByteBuffer() { super.appendToByteBuffer(); }

}

/**
 * @param {Type} keyType
 * @param {Type} valueType
 * @returns {MapType}
 */
export default (keyType, valueType) => new MapType(keyType, valueType);
