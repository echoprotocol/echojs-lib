import ByteBuffer from 'bytebuffer';

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

	/** @typedef {*} _MapKey */
	/** @typedef {*} _MapValue */

	/** @param {Array<[_MapKey,_MapValue]>} value */
	validate(value) {
		if (!Array.isArray(value)) throw new Error('value is not an array');
		/** @type {Set<string>} */
		const keysSet = new Set();
		for (const element of value) {
			if (!Array.isArray(element)) throw new Error('element of a value is not an array');
			if (element.length !== 2) throw new Error('expected 2 subelements (key and value)');
			const [key, elementValue] = element;
			const keyByteBuffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
			this.keyType.appendToByteBuffer(key, keyByteBuffer);
			const keyBytes = keyByteBuffer.toString('binary');
			if (keysSet.has(keyBytes)) throw new Error('keys duplicates');
			keysSet.add(keyBytes);
			this.valueType.validate(elementValue);
		}
	}

	/**
	 * @param {Array<[_MapKey,_MapValue]>} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		if (!(bytebuffer instanceof ByteBuffer)) throw new Error('invalid bytebuffer type');
		bytebuffer.writeVarint32(value.length);
		for (const [key, element] of value) {
			this.keyType.appendToByteBuffer(key, bytebuffer);
			this.valueType.appendToByteBuffer(element, bytebuffer);
		}
	}

}

/**
 * @param {Type} keyType
 * @param {Type} valueType
 * @returns {MapType}
 */
export default (keyType, valueType) => new MapType(keyType, valueType);
