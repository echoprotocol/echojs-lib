import Type from '../type';
import PublicKey from '../../crypto/ECDSA/public-key';

class PublicKeyTypeECDSA extends Type {

	/**
	 * @param {PublicKey|string} value
	 * @returns {PublicKey}
	 */
	validate(value) {
		if (value instanceof PublicKey) return value;
		if (typeof value !== 'string') throw new Error('invalid publicKey type');
		return PublicKey.fromStringOrThrow(value);
	}

	/**
	 * @param {PublicKey|string} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		value = this.validate(value);
		bytebuffer.append(value.toBuffer().toString('binary'), 'binary');
	}

	/**
	 * @param {string|PublicKey} value
	 * @returns {string}
	 */
	toObject(value) { return this.validate(value).toString(); }

}

export default new PublicKeyTypeECDSA();
