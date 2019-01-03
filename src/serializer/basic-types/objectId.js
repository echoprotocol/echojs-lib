import Long from 'long';
import Type from '../type';
import { idRegex } from '../../utils/validators';

class ObjectId extends Type {

	/** @param {string} value */
	validate(value) {
		if (typeof value !== 'string') throw new Error('value is not a string');
		if (!idRegex.test(value)) throw new Error('invalid id format');
		// FIXME: write size validators
	}

	/**
	 * @param {string} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		const [reservedSpaceId, objectTypeId, instanceId] = value.split('.').map((str) => Long.fromString(str, true));
		bytebuffer.writeUint64(reservedSpaceId.shiftLeft(56).or(objectTypeId.shiftLeft(48).or(instanceId)));
	}

}

const objectId = new ObjectId();

export default objectId;
