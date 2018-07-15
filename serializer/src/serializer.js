const ByteBuffer = require('bytebuffer');
const EC = require('./error_with_cause');

const HEX_DUMP = process.env.npm_config__graphene_serializer_hex_dump;

class Serializer {

	constructor(operationName, types) {
		this.operation_name = operationName;
		this.types = types;
		if (this.types) {
			this.keys = Object.keys(this.types);
		}

		Serializer.printDebug = true;
	}

	fromByteBuffer(b) {
		const object = {};
		let field = null;
		try {
			const iterable = this.keys;
			for (let i = 0; i < iterable.length; i += 1) {
				field = iterable[i];
				const type = this.types[field];
				try {
					if (HEX_DUMP) {
						if (type.operation_name) {
							console.error(type.operation_name);
						} else {
							const o1 = b.offset;
							type.fromByteBuffer(b);
							const o2 = b.offset;
							b.offset = o1;
							//	b.reset()
							const _b = b.copy(o1, o2);
							console.error(
								`${this.operation_name}.${field}\t`,
								_b.toHex(),
							);
						}
					}
					object[field] = type.fromByteBuffer(b);
				} catch (e) {
					if (Serializer.printDebug) {
						console.error(`Error reading ${this.operation_name}.${field} in data:`);
						b.printDebug();
					}
					throw e;
				}
			}

		} catch (error) {
			EC.throw(`${this.operation_name}.${field}`, error);
		}

		return object;
	}

	appendByteBuffer(b, object) {
		let field = null;
		try {
			const iterable = this.keys;
			for (let i = 0; i < iterable.length; i += 1) {
				field = iterable[i];
				const type = this.types[field];
				type.appendByteBuffer(b, object[field]);
			}

		} catch (error) {
			try {
				EC.throw(`${this.operation_name}.${field} = ${JSON.stringify(object[field])}`, error);
			} catch (e) {
				// circular ref
				EC.throw(`${this.operation_name}.${field} = ${object[field]}`, error);
			}
		}
	}

	fromObject(serializedObject) {
		const result = {};
		let field = null;
		try {
			const iterable = this.keys;
			for (let i = 0; i < iterable.length; i += 1) {
				field = iterable[i];
				const type = this.types[field];
				const value = serializedObject[field];
				if (process.env.DEBUG && value) {
					if (value.resolve) {
						console.log('... value', field, value.resolve);
					}
				}
				const object = type.fromObject(value);
				result[field] = object;
			}

		} catch (error) {
			EC.throw(`${this.operation_name}.${field}`, error);
		}

		return result;
	}

	/**
		@arg {boolean} [debug.use_default = false] - more template friendly
		@arg {boolean} [debug.annotate = false] - add user-friendly information
	*/
	toObject(serializedObject = {}, debug = { use_default: false, annotate: false }) {
		const result = {};
		let field = null;
		try {
			if (!this.types) {
				return result;
			}

			const iterable = this.keys;
			for (let i = 0; i < iterable.length; i += 1) {
				field = iterable[i];
				const type = this.types[field];
				const object = type.toObject(((typeof serializedObject !== 'undefined' && serializedObject !== null) ? serializedObject[field] : undefined), debug);

				result[field] = object;
				if (HEX_DUMP) {
					let b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
					type.appendByteBuffer(b, ((typeof serializedObject !== 'undefined' && serializedObject !== null) ? serializedObject[field] : undefined));
					b = b.copy(0, b.offset);
					console.error(`${this.operation_name}.${field}`, b.toHex());
				}
			}
		} catch (error) {
			EC.throw(`${this.operation_name}.${field}`, error);
		}

		return result;
	}

	/** Sort by the first element in a operation */
	compare(a, b) {

		const firstKey = this.keys[0];
		const firstType = this.types[firstKey];

		const valA = a[firstKey];
		const valB = b[firstKey];

		if (firstType.compare) {
			return firstType.compare(valA, valB);
		}

		if (typeof valA === 'number' && typeof valB === 'number') {
			return valA - valB;
		}

		let encoding;
		if (Buffer.isBuffer(valA) && Buffer.isBuffer(valB)) {
			// A binary string compare does not work.
			// If localeCompare is well supported that could replace HEX.
			// Performanance is very good so comparing HEX works.
			encoding = 'hex';
		}

		const strA = valA.toString(encoding);
		const strB = valB.toString(encoding);

		if (strA === strB) { return 0; }

		return strA > strB ? 1 : -1;
	}

	// <helper_functions>

	fromHex(hex) {
		const b = ByteBuffer.fromHex(hex, ByteBuffer.LITTLE_ENDIAN);
		return this.fromByteBuffer(b);
	}

	fromBuffer(buffer) {
		const b = ByteBuffer.fromBinary(buffer.toString('binary'), ByteBuffer.LITTLE_ENDIAN);
		return this.fromByteBuffer(b);
	}

	toHex(object) {
		// return this.toBuffer(object).toString('hex')
		const b = this.toByteBuffer(object);
		return b.toHex();
	}

	/**
	 * @param object
	 * @returns {ByteBuffer}
	 */
	toByteBuffer(object) {
		const b = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
		this.appendByteBuffer(b, object);
		return b.copy(0, b.offset);
	}

	/**
	 * @param object
	 * @returns {Buffer}
	 */
	toBuffer(object) {
		return Buffer.from(this.toByteBuffer(object).toBinary(), 'binary');
	}

}

module.exports = Serializer;
