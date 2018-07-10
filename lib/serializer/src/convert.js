import ByteBuffer from 'bytebuffer';

const toByteBuffer = (type, object) => {
	const b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
	type.appendByteBuffer(b, object);
	return b.copy(0, b.offset);
};

export default function (type) {

	return {
		fromHex(hex) {
			const b = ByteBuffer.fromHex(hex, ByteBuffer.LITTLE_ENDIAN);
			return type.fromByteBuffer(b);
		},

		toHex(object) {
			const b = toByteBuffer(type, object);
			return b.toHex();
		},

		fromBuffer(buffer) {
			const b = ByteBuffer.fromBinary(buffer.toString(), ByteBuffer.LITTLE_ENDIAN);
			return type.fromByteBuffer(b);
		},

		toBuffer(object) {
			return Buffer.from(toByteBuffer(type, object).toBinary(), 'binary');
		},

		fromBinary(string) {
			const b = ByteBuffer.fromBinary(string, ByteBuffer.LITTLE_ENDIAN);
			return type.fromByteBuffer(b);
		},

		toBinary(object) {
			return toByteBuffer(type, object).toBinary();
		},
	};
}
