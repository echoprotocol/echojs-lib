import Long from 'long';
import Serializable from '../../serializable';
import { idRegex } from '../../../utils/validators';

// TODO: jsdoc
class ObjectId extends Serializable {

	/** @param {string} value */
	toRaw(value) {
		if (typeof value !== 'string') throw new Error('value is not a string');
		if (!idRegex.test(value)) throw new Error('invalid id format');
		// FIXME: write size validators
		return value;
	}

	/**
	 * @param {string} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		const raw = this.toRaw(value);
		const [reservedSpaceId, objectTypeId, instanceId] = raw.split('.').map((str) => Long.fromString(str, true));
		bytebuffer.writeUint64(reservedSpaceId.shiftLeft(56).or(objectTypeId.shiftLeft(48).or(instanceId)));
	}

}

export default new ObjectId();
