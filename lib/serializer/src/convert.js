import ByteBuffer from "bytebuffer";

export default function(type) {

	return {
		fromHex(hex) {
			let b = ByteBuffer.fromHex(hex, ByteBuffer.LITTLE_ENDIAN);
			return type.fromByteBuffer(b);
		},

		toHex(object) {
			let b = toByteBuffer(type, object);
			return b.toHex();
		},

		fromBuffer(buffer) {
			let b = ByteBuffer.fromBinary(buffer.toString(), ByteBuffer.LITTLE_ENDIAN);
			return type.fromByteBuffer(b);
		},

		toBuffer(object) {
			return new Buffer(toByteBuffer(type, object).toBinary(), "binary");
		},

		fromBinary(string) {
			let b = ByteBuffer.fromBinary(string, ByteBuffer.LITTLE_ENDIAN);
			return type.fromByteBuffer(b);
		},

		toBinary(object) {
			return toByteBuffer(type, object).toBinary();
		}
	};
}

var toByteBuffer = function(type, object) {
	let b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
	type.appendByteBuffer(b, object);
	return b.copy(0, b.offset);
};
