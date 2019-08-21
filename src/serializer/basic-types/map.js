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
	/** @typedef {Array<[_MapKey,_MapValue]> | Map<_MapKey, _MapValue> | { [key: _MapKey]: _MapValue }} _InputType */

	/**
	 * @param {_InputType} value
	 * @returns {[_MapKey, _MapValue][]}
	 */
	validate(value) {
		if (value instanceof Map) value = [...value.entries()];
		else if (!Array.isArray(value)) {
			if (typeof value !== 'object') throw new Error('invalid map value');
			value = Object.keys(value).map((key) => [key, value[key]]);
		}
		/** @type {Set<string>} */
		const keysSet = new Set();
		for (let i = 0; i < value.length; i += 1) {
			const element = value[i];
			if (!Array.isArray(element)) throw new Error('element of a value is not an array');
			if (element.length !== 2) throw new Error('expected 2 subelements (key and value)');
			const [key, elementValue] = element;

			const keyByteBuffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
			try {
				this.keyType.appendToByteBuffer(key, keyByteBuffer);
			} catch (error) {
				throw new Error(`key of map at element with index ${i}: ${error}`);
			}
			const keyBytes = keyByteBuffer.copy(0, keyByteBuffer.offset).toString('binary');
			if (keysSet.has(keyBytes)) throw new Error('keys duplicates');
			keysSet.add(keyBytes);

			try {
				this.valueType.validate(elementValue);
			} catch (error) {
				throw new Error(`value of map at element with index ${i}: ${error}`);
			}
		}
		return value;
	}

	/**
	 * @param {_InputType} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		value = this.validate(value);
		if (!(bytebuffer instanceof ByteBuffer)) throw new Error('invalid bytebuffer type');
		bytebuffer.writeVarint32(value.length);
		for (const [key, element] of value) {
			this.keyType.appendToByteBuffer(key, bytebuffer);
			this.valueType.appendToByteBuffer(element, bytebuffer);
		}
	}

	/**
	 * @param {_InputType} value
	 * @param {Array<[*,*]>} value
	 */
	toObject(value) {
		value = this.validate(value);
		return value.map(([key, element]) => [this.keyType.toObject(key), this.valueType.toObject(element)]);
	}

}

/**
 * @param {Type} keyType
 * @param {Type} valueType
 * @returns {MapType}
 */
export default (keyType, valueType) => new MapType(keyType, valueType);
