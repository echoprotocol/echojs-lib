/* eslint-disable no-bitwise */

const { Long } = require('bytebuffer');

const v = require('../../serializer/src/SerializerValidation');

const DB_MAX_INSTANCE_ID = Long.fromNumber(((2 ** 48) - 1));

class ObjectId {

	constructor(space, type, instance) {
		this.space = space;
		this.type = type;
		this.instance = instance;
		const instanceString = this.instance.toString();
		const objectId = `${this.space}.${this.type}.${instanceString}`;
		if (!v.is_digits(instanceString)) {
			throw new `Invalid object id ${objectId}`();
		}
	}

	static fromString(value) {
		if (
			value.space !== undefined &&
			value.type !== undefined &&
			value.instance !== undefined
		) {
			return value;
		}

		const params = v.require_match(
			/^([0-9]+)\.([0-9]+)\.([0-9]+)$/,
			v.required(value, 'ObjectId'),
			'ObjectId',
		);
		return new ObjectId(
			parseInt(params[1], 10),
			parseInt(params[2], 10),
			Long.fromString(params[3]),
		);
	}

	static fromLong(long) {
		const space = long.shiftRight(56).toInt();
		const type = long.shiftRight(48).toInt() & 0x00ff;
		const instance = long.and(DB_MAX_INSTANCE_ID);
		return new ObjectId(space, type, instance);
	}

	static fromByteBuffer(b) {
		return ObjectId.fromLong(b.readUint64());
	}

	toLong() {
		const space = Long.fromNumber(this.space);
		const type = Long.fromNumber(this.type);
		return space.shiftLeft(56).or(type.shiftLeft(48).or(this.instance));
	}

	appendByteBuffer(b) {
		return b.writeUint64(this.toLong());
	}

	toString() {
		return `${this.space}.${this.type}.${this.instance.toString()}`;
	}

}

module.exports = ObjectId;
