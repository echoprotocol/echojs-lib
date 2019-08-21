import Serializable from '../serializable';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @augments {Serializable<boolean, boolean>} */
export class BoolType extends Serializable {

	/**
	 * @param {boolean} value
	 * @returns {boolean}
	 */
	toRaw(value) {
		if (typeof value !== 'boolean') throw new Error('invalid bool value type');
		return value;
	}

	/**
	 * @param {boolean} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		bytebuffer.writeUint8(raw ? 1 : 0);
	}

}

const bool = new BoolType();
export default bool;
