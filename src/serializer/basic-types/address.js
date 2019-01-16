import ByteBuffer from 'bytebuffer';
import { decode } from 'bs58';

import Type from '../type';
import PublicKey from '../../crypto/public-key';
import { CHAIN_CONFIG } from '../../constants';
import { ripemd160 } from '../../crypto/hash';

function addressToBytecode(value) {
	if (value instanceof PublicKey) value.toAddressString();
	if (typeof value !== 'string') throw new Error('value is not an address');
	const prefix = value.slice(0, CHAIN_CONFIG.ADDRESS_PREFIX.length);
	if (CHAIN_CONFIG.ADDRESS_PREFIX !== prefix) throw new Error('invalid address prefix');
	const bufferWithCheckSum = Buffer.from(decode(value.slice(CHAIN_CONFIG.ADDRESS_PREFIX.length)), 'binary');
	const checksum = bufferWithCheckSum.slice(-4);
	const newCheckSum = ripemd160(value);
	if (!checksum.equals(newCheckSum.slice(0, 4))) throw new Error('checksum did not match');
	return bufferWithCheckSum.slice(0, -4);
}

class AddressType extends Type {

	/**
	 * @param {string|PublicKey} value */
	validate(value) {
		addressToBytecode(value);
	}

	/**
	 * @param {string|PublicKey} value
	 * @param {ByteBuffer} bytebuffer
	 */
	appendToByteBuffer(value, bytebuffer) {
		if (!(bytebuffer instanceof ByteBuffer)) throw new Error('invalid type of bytebuffer');
		const buffer = addressToBytecode(value);
		const length = 20;
		const data = buffer.slice(0, length).toString('binary');
		bytebuffer.append(data, 'binary');
		const offset = data.length - length;
		for (let i = 0; i < offset; i += 1) bytebuffer.writeUint8(0);
	}

	/**
	 * @param {string|PublicKey} value
	 * @returns {string}
	 */
	toObject(value) {
		this.validate(value);
		return (value instanceof PublicKey) ? value.toAddressString() : value;
	}

}

export default new AddressType();
