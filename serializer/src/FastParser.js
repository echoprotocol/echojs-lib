/* eslint-disable consistent-return */

const PublicKey = require('../../ecc/src/PublicKey');

class FastParser {

	static fixedData(b, len, buffer) {
		if (!b) {
			return;
		}

		if (buffer) {
			const data = buffer.slice(0, len).toString('binary');
			b.append(data, 'binary');
			while (len > data.length) {
				len -= 1;
				b.writeUint8(0);
			}
		} else {
			const bCopy = b.copy(b.offset, b.offset + len);
			b.skip(len);
			return Buffer.from(bCopy.toBinary(), 'binary');
		}
	}

	/**
	 * @param b
	 * @param {Serializer} publicKey
	 * @returns {*}
	 */
	static publicKey(b, publicKey) {
		if (!b) {
			return;
		}
		if (publicKey) {
			const buffer = publicKey.toBuffer();
			b.append(buffer.toString('binary'), 'binary');
		} else {
			const buffer = FastParser.fixedData(b, 33);
			return PublicKey.fromBuffer(buffer);
		}
	}

	static ripemd160(b, ripemd160) {
		if (!b) {
			return;
		}
		if (ripemd160) {
			FastParser.fixedData(b, 20, ripemd160);
		} else {
			return FastParser.fixedData(b, 20);
		}
	}

	static timePointSec(b, epoch) {
		if (epoch) {
			epoch = Math.ceil(epoch / 1000);
			b.writeInt32(epoch);
		} else {
			epoch = b.readInt32(); // fc::time_point_sec
			return new Date(epoch * 1000);
		}
	}

}

module.exports = FastParser;
