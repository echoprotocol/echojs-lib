import * as ByteBuffer from 'bytebuffer';
import BigNumber from 'bignumber.js';
import { uint64 } from '../../basic/integers';
import ISerializer from '../../ISerializer';
import { idRegex } from '../../../utils/validators';

/** @typedef {string} TInput */
/** @typedef {string} TOutput */

/** @augments {ISerializer<TInput, TOutput>} */
export default class AnyObjectIdSerializer extends ISerializer {

	/**
	 * @param {TInput} value
	 * @returns {TOutput}
	 */
	toRaw(value) {
		if (typeof value !== 'string') throw new Error('value is not a string');
		if (!idRegex.test(value)) throw new Error('invalid id format');
		// FIXME: write size validators
		return value;
	}

	/**
	 * @param {TInput} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		this.validate(value);
		const [reservedSpaceId, objectTypeId, instanceId] = value.split('.').map((str) =>
			ByteBuffer.Long.fromString(str, true));
		const long = reservedSpaceId.shiftLeft(56).or(objectTypeId.shiftLeft(48).or(instanceId));
		uint64.appendToByteBuffer(new BigNumber(long.toString()), bytebuffer);
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const { res: serializedId, newOffset } = uint64.readFromBuffer(buffer, offset);
		const bn = new BigNumber(serializedId);
		const reservedSpaceId = bn.idiv('0x100000000000000');
		const objectTypeId = bn.mod('0x100000000000000').idiv(0x1000000000000);
		const instanceId = bn.mod(0x1000000000000);
		const fullId = [reservedSpaceId, objectTypeId, instanceId].map((part) => part.toString(10)).join('.');
		return { res: this.toRaw(fullId), newOffset };
	}

}
