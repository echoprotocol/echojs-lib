import PublicKey from "../../ecc/src/PublicKey";
import Serializer from "./serializer";

class FastParser {

	static fixed_data(b, len, buffer) {
		if (!b) {
			return;
		}
		if (buffer) {
			let data = buffer.slice(0, len).toString("binary");
			b.append(data, "binary");
			while (len-- > data.length) {
				b.writeUint8(0);
			}
		} else {
			let b_copy = b.copy(b.offset, b.offset + len);
			b.skip(len);
			return Buffer.from(b_copy.toBinary(), "binary");
		}
	}

    /**
     * @param b
     * @param {Serializer} public_key
     * @returns {*}
     */
	static public_key(b, public_key) {
		if (!b) {
			return;
		}
		if (public_key) {
            let buffer = public_key.toBuffer();
			b.append(buffer.toString("binary"), "binary");
		} else {
			let buffer = FastParser.fixed_data(b, 33);
			return PublicKey.fromBuffer(buffer);
		}
	}

	static ripemd160(b, ripemd160) {
		if (!b) {
			return;
		}
		if (ripemd160) {
			FastParser.fixed_data(b, 20, ripemd160);
		} else {
			return FastParser.fixed_data(b, 20);
		}
	}

	static time_point_sec(b, epoch) {
		if (epoch) {
			epoch = Math.ceil(epoch / 1000);
			b.writeInt32(epoch);
		} else {
			epoch = b.readInt32(); // fc::time_point_sec
			return new Date(epoch * 1000);
		}
	}
}

export default FastParser;
