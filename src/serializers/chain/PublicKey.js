import ISerializer from '../ISerializer';
import PublicKey from '../../crypto/public-key';

/** @typedef {import("bytebuffer")} ByteBuffer */

/** @typedef {PublicKey | string} TInput */
/** @typedef {string} TOutput */

/** @augments {ISerializer<TInput, TOutput>} */
export default class PublicKeySerializer extends ISerializer {

	/**
	 * @param {TInput} value
	 * @param {string} [addressPrefix]
	 * @returns {TOutput}
	 */
	toRaw(value, addressPrefix) {
		if (typeof value === 'string') {
			value = PublicKey.fromStringOrThrow(value, addressPrefix);
		}
		if (!(value instanceof PublicKey)) throw new Error('invalid publicKey type');
		return value.toPublicKeyString(addressPrefix);
	}

	/**
	 * @param {TInput} value
	 * @param {ByteBuffer} bytebuffer
	 * @param {string} [addressPrefix]
	 */
	appendToByteBuffer(value, bytebuffer, addressPrefix) {
		const raw = this.toRaw(value, addressPrefix);
		const publicKey = PublicKey.fromStringOrThrow(raw, addressPrefix);
		bytebuffer.append(publicKey.toBuffer().toString('binary'), 'binary');
	}

	/**
	 * @param {Buffer} buffer
	 * @param {number} [offset]
	 * @returns {{ res: TOutput, newOffset: number }}
	 */
	readFromBuffer(buffer, offset = 0) {
		const length = 32;
		const newOffset = offset + length;
		if (newOffset > buffer.length) throw new Error('unexpected end of buffer');
		const bytes = buffer.slice(offset, newOffset);
		return { res: PublicKey.fromBuffer(bytes).toString(), newOffset };
	}

}
