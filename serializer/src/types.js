/* eslint-disable no-bitwise */
const { ChainConfig } = require('echojs-ws');

// Low-level types that make up operations

const v = require('./SerializerValidation');
const fp = require('./FastParser');

const ChainTypes = require('../../chain/src/ChainTypes');
const ObjectId = require('../../chain/src/ObjectId');

const { PublicKey, Address, PublicKeyECDSA } = require('../../ecc');

const Types = {};

const HEX_DUMP = process.env.npm_config__graphene_serializer_hex_dump;

const strCmp = (a, b) => {
	if (a === b) { return 0; }
	return a > b ? 1 : -1;
};
const firstEl = (el) => (Array.isArray(el) ? el[0] : el);
const sortOperation = (array, stOperation) => {
	if (stOperation.nosort) { return array; }

	if (stOperation.compare) {
		// custom compare operation
		return array.sort((a, b) => stOperation.compare(firstEl(a), firstEl(b)));
	}

	return array.sort((a, b) => {
		if (typeof firstEl(a) === 'number' && typeof firstEl(b) === 'number') {
			return firstEl(a) - firstEl(b);
		}
		// A binary string compare does not work.
		// Performanance is very good so HEX is used..  localeCompare is another option.
		if (Buffer.isBuffer(firstEl(a)) && Buffer.isBuffer(firstEl(b))) {
			return strCmp(firstEl(a).toString('hex'), firstEl(b).toString('hex'));
		}

		return strCmp(firstEl(a).toString(), firstEl(b).toString());
	});
};

Types.uint8 = {

	fromByteBuffer(b) {
		return b.readUint8();
	},
	appendByteBuffer(b, object) {
		v.require_range(0, 0xFF, object, `uint8 ${object}`);
		b.writeUint8(object);
	},
	fromObject(object) {
		v.require_range(0, 0xFF, object, `uint8 ${object}`);
		return object;
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return 0;
		}
		v.require_range(0, 0xFF, object, `uint8 ${object}`);
		return parseInt(object, 10);
	},
};

Types.uint16 = {
	fromByteBuffer(b) {
		return b.readUint16();
	},
	appendByteBuffer(b, object) {
		v.require_range(0, 0xFFFF, object, `uint16 ${object}`);
		b.writeUint16(object);
	},
	fromObject(object) {
		v.require_range(0, 0xFFFF, object, `uint16 ${object}`);
		return object;
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return 0;
		}
		v.require_range(0, 0xFFFF, object, `uint16 ${object}`);
		return parseInt(object, 10);
	},
};

Types.uint32 = {
	fromByteBuffer(b) {
		return b.readUint32();
	},
	appendByteBuffer(b, object) {
		v.require_range(0, 0xFFFFFFFF, object, `uint32 ${object}`);
		b.writeUint32(object);

	},
	fromObject(object) {
		v.require_range(0, 0xFFFFFFFF, object, `uint32 ${object}`);
		return object;
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return 0;
		}
		v.require_range(0, 0xFFFFFFFF, object, `uint32 ${object}`);
		return parseInt(object, 10);
	},
};

const MIN_SIGNED_32 = -1 * (2 ** 31);
const MAX_SIGNED_32 = (2 ** 31) - 1;

Types.varint32 = {
	fromByteBuffer(b) {
		return b.readVarint32();
	},
	appendByteBuffer(b, object) {
		v.require_range(
			MIN_SIGNED_32,
			MAX_SIGNED_32,
			object,
			`uint32 ${object}`,
		);
		b.writeVarint32(object);

	},
	fromObject(object) {
		v.require_range(
			MIN_SIGNED_32,
			MAX_SIGNED_32,
			object,
			`uint32 ${object}`,
		);
		return object;
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return 0;
		}
		v.require_range(
			MIN_SIGNED_32,
			MAX_SIGNED_32,
			object,
			`uint32 ${object}`,
		);
		return parseInt(object, 10);
	},
};

Types.int64 = {
	fromByteBuffer(b) {
		return b.readInt64();
	},
	appendByteBuffer(b, object) {
		v.required(object);
		b.writeInt64(v.to_long(object));
	},
	fromObject(object) {
		v.required(object);
		return v.to_long(object);
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return '0';
		}
		v.required(object);
		return v.to_long(object).toString();
	},
};

Types.uint64 = {
	fromByteBuffer(b) {
		return b.readUint64();
	},
	appendByteBuffer(b, object) {
		b.writeUint64(v.to_long(v.unsigned(object)));

	},
	fromObject(object) {
		return v.to_long(v.unsigned(object));
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return '0';
		}
		return v.to_long(object).toString();
	},
};

Types.string = {
	fromByteBuffer(b) {
		const len = b.readVarint32();
		const bCopy = b.copy(b.offset, b.offset + len);
		b.skip(len);
		return Buffer.from(bCopy.toBinary(), 'binary');
	},
	appendByteBuffer(b, object) {
		v.required(object);
		b.writeVarint32(object.length);
		b.append(object.toString('binary'), 'binary');

	},
	fromObject(object) {
		v.required(object);
		return Buffer.from(object);
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return '';
		}
		return object.toString();
	},
};

Types.bytes = (size) => ({
	fromByteBuffer(b) {
		if (size === undefined) {
			const len = b.readVarint32();
			const bCopy = b.copy(b.offset, b.offset + len);
			b.skip(len);
			return Buffer.from(bCopy.toBinary(), 'binary');
		}

		const bCopy = b.copy(b.offset, b.offset + size);
		b.skip(size);
		return Buffer.from(bCopy.toBinary(), 'binary');

	},
	appendByteBuffer(b, object) {
		v.required(object);
		if (typeof object === 'string') {
			object = Buffer.from(object, 'hex');
		}

		if (size === undefined) {
			b.writeVarint32(object.length);
		}
		b.append(object.toString('binary'), 'binary');

	},
	fromObject(object) {
		v.required(object);
		if (Buffer.isBuffer(object)) {
			return object;
		}

		return Buffer.from(object, 'hex');
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			const zeros = (num) => new Array(num).join('00');
			return zeros(size);
		}
		v.required(object);
		return object.toString('hex');
	},
});

Types.bool = {
	fromByteBuffer(b) {
		return b.readUint8() === 1;
	},
	appendByteBuffer(b, object) {
		// supports boolean or integer
		b.writeUint8(JSON.parse(object) ? 1 : 0);

	},
	fromObject(object) {
		return !!JSON.parse(object);
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return false;
		}
		return !!JSON.parse(object);
	},
};

Types.void = {
	fromByteBuffer() {
		throw new Error('(void) undefined type');
	},
	appendByteBuffer() {
		throw new Error('(void) undefined type');
	},
	fromObject() {
		throw new Error('(void) undefined type');
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return undefined;
		}
		throw new Error('(void) undefined type');
	},
};

Types.array = (stOperation) => ({
	fromByteBuffer(b) {
		const size = b.readVarint32();
		if (HEX_DUMP) {
			console.log(`varint32 size = ${size.toString(16)}`);
		}
		const result = [];
		for (let i = 0; size > 0 ? i < size : i > size; i += 1) {
			result.push(stOperation.fromByteBuffer(b));
		}
		return sortOperation(result, stOperation);
	},
	appendByteBuffer(b, object) {
		v.required(object);
		object = sortOperation(object, stOperation);
		b.writeVarint32(object.length);
		for (let i = 0, o; i < object.length; i += 1) {
			o = object[i];
			stOperation.appendByteBuffer(b, o);
		}
	},
	fromObject(object) {
		v.required(object);
		object = sortOperation(object, stOperation);
		const result = [];
		for (let i = 0, o; i < object.length; i += 1) {
			o = object[i];
			result.push(stOperation.fromObject(o));
		}
		return result;
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return [stOperation.toObject(object, debug)];
		}
		v.required(object);
		object = sortOperation(object, stOperation);

		const result = [];
		for (let i = 0, o; i < object.length; i += 1) {
			o = object[i];
			result.push(stOperation.toObject(o, debug));
		}
		return result;
	},

});

Types.time_point_sec = {
	fromByteBuffer(b) {
		return b.readUint32();
	},
	appendByteBuffer(b, object) {
		if (typeof object !== 'number') {
			object = Types.time_point_sec.fromObject(object);
		}

		b.writeUint32(object);

	},
	fromObject(object) {
		v.required(object);

		if (typeof object === 'number') {
			return object;
		}

		if (object.getTime) {
			return Math.floor(object.getTime() / 1000);
		}

		if (typeof object !== 'string') {
			throw new Error(`Unknown date type: ${object}`);
		}

		// if(typeof object === 'string' && !/Z$/.test(object))
		//	 object = object + 'Z'

		return Math.floor(new Date(object).getTime() / 1000);
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return (new Date(0)).toISOString().split('.')[0];
		}

		v.required(object);

		if (typeof object === 'string') {
			return object;
		}

		if (object.getTime) {
			return object.toISOString().split('.')[0];
		}

		const int = parseInt(object, 10);
		v.require_range(0, 0xFFFFFFFF, int, `uint32 ${object}`);
		return (new Date(int * 1000)).toISOString().split('.')[0];
	},
};

Types.set = function (stOperation) {
	return {
		validate(array) {
			const dupMap = {};
			for (let i = 0; i < array.length; i += 1) {
				if (['string', 'number'].indexOf(typeof array[i]) >= 0) {
					if (dupMap[array[i]] !== undefined) {
						throw new Error('duplicate (set)');
					}
					dupMap[array[i]] = true;
				}
			}
			return sortOperation(array, stOperation);
		},
		fromByteBuffer(b) {
			const size = b.readVarint32();
			if (HEX_DUMP) {
				console.log(`varint32 size = ${size.toString(16)}`);
			}
			return this.validate(((() => {
				const result = [];
				for (let i = 0; size > 0 ? i < size : i > size; i += 1) {
					result.push(stOperation.fromByteBuffer(b));
				}
				return result;
			})()));
		},
		appendByteBuffer(b, object) {
			if (!object) {
				object = [];
			}
			b.writeVarint32(object.length);
			const iterable = this.validate(object);
			for (let i = 0, o; i < iterable.length; i += 1) {
				o = iterable[i];
				stOperation.appendByteBuffer(b, o);
			}

		},
		fromObject(object) {
			if (!object) {
				object = [];
			}
			return this.validate(((() => {
				const result = [];
				for (let i = 0, o; i < object.length; i += 1) {
					o = object[i];
					result.push(stOperation.fromObject(o));
				}
				return result;
			})()));
		},
		toObject(object, debug = {}) {
			if (debug.use_default && object === undefined) {
				return [stOperation.toObject(object, debug)];
			}
			if (!object) {
				object = [];
			}
			return this.validate(((() => {
				const result = [];
				for (let i = 0, o; i < object.length; i += 1) {
					o = object[i];
					result.push(stOperation.toObject(o, debug));
				}
				return result;
			})()));
		},
	};
};

// global_parameters_update_operation current_fees
Types.fixed_array = function (count, stOperation) {
	return {
		fromByteBuffer(b) {
			const results = [];
			for (let i = 0; i < count; i += 1) {
				results.push(stOperation.fromByteBuffer(b));
			}
			return sortOperation(results, stOperation);
		},
		appendByteBuffer(b, object) {
			if (count !== 0) {
				v.required(object);
				object = sortOperation(object, stOperation);
			}

			for (let i = 0; i < count; i += 1) {
				stOperation.appendByteBuffer(b, object[i]);
			}
		},
		fromObject(object) {
			if (count !== 0) {
				v.required(object);
			}
			const results = [];
			for (let i = 0; i < count; i += 1) {
				results.push(stOperation.fromObject(object[i]));
			}
			return results;
		},
		toObject(object, debug) {
			if (debug == null) {
				debug = {};
			}

			const results = [];

			if (debug.use_default && object === undefined) {
				for (let i = 0; i < count; i += 1) {
					results.push(stOperation.toObject(undefined, debug));
				}
				return results;
			}

			if (count !== 0) {
				v.required(object);
			}

			for (let i = 0; i < count; i += 1) {
				results.push(stOperation.toObject(object[i], debug));
			}
			return results;
		},
	};
};

/* Supports instance numbers (11) or object types (1.2.11).  Object type
Validation is enforced when an object type is used. */
const idType = (reservedSpaces, objectType) => {
	v.required(reservedSpaces, 'reserved_spaces');
	v.required(objectType, 'object_type');
	return {
		fromByteBuffer(b) {
			return b.readVarint32();
		},
		appendByteBuffer(b, object) {
			v.required(object);
			if (object.resolve !== undefined) {
				object = object.resolve;
			}
			// convert 1.2.n into just n
			if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(object)) {
				object = v.get_instance(reservedSpaces, objectType, object);
			}
			b.writeVarint32(v.to_number(object));

		},
		fromObject(object) {
			v.required(object);
			if (object.resolve !== undefined) {
				object = object.resolve;
			}
			if (v.is_digits(object)) {
				return v.to_number(object);
			}
			return v.get_instance(reservedSpaces, objectType, object);
		},
		toObject(object, debug = {}) {
			const objectTypeId = ChainTypes.object_type[objectType];
			if (debug.use_default && object === undefined) {
				return `${reservedSpaces}.${objectTypeId}.0`;
			}
			v.required(object);
			if (object.resolve !== undefined) {
				object = object.resolve;
			}
			if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(object)) {
				object = v.get_instance(reservedSpaces, objectType, object);
			}

			return `${reservedSpaces}.${objectTypeId}.${object}`;
		},
	};
};

Types.protocol_id_type = (name) => {
	v.required(name, 'name');
	return idType(ChainTypes.reserved_spaces.protocol_ids, name);
};

Types.object_id_type = {
	fromByteBuffer(b) {
		return ObjectId.fromByteBuffer(b);
	},
	appendByteBuffer(b, object) {
		v.required(object);
		if (object.resolve !== undefined) {
			object = object.resolve;
		}
		object = ObjectId.fromString(object);
		object.appendByteBuffer(b);
	},
	fromObject(object) {
		v.required(object);
		if (object.resolve !== undefined) {
			object = object.resolve;
		}
		return ObjectId.fromString(object);
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return '0.0.0';
		}
		v.required(object);
		if (object.resolve !== undefined) {
			object = object.resolve;
		}
		object = ObjectId.fromString(object);
		return object.toString();
	},
};

Types.vote_id = {
	TYPE: 0x000000FF,
	ID: 0xFFFFFF00,
	fromByteBuffer(b) {
		const value = b.readUint32();
		return {
			type: value && this.TYPE,
			id: value && this.ID,
		};
	},
	appendByteBuffer(b, object) {
		v.required(object);
		if (object === 'string') {
			object = Types.vote_id.fromObject(object);
		}

		const value = (object.id << 8) | object.type;
		b.writeUint32(value);
	},
	fromObject(object) {
		v.required(object, '(type vote_id)');
		if (typeof object === 'object') {
			v.required(object.type, 'type');
			v.required(object.id, 'id');
			return object;
		}
		v.require_test(/^[0-9]+:[0-9]+$/, object, `vote_id format ${object}`);
		const [type, id] = object.split(':');
		v.require_range(0, 0xff, type, `vote type ${object}`);
		v.require_range(0, 0xffffff, id, `vote id ${object}`);
		return { type, id };
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return '0:0';
		}
		v.required(object);
		if (typeof object === 'string') {
			object = Types.vote_id.fromObject(object);
		}

		return `${object.type}:${object.id}`;
	},
	compare(a, b) {
		if (typeof a !== 'object') {
			a = Types.vote_id.fromObject(a);
		}
		if (typeof b !== 'object') {
			b = Types.vote_id.fromObject(b);
		}
		return parseInt(a.id, 10) - parseInt(b.id, 10);
	},
};

Types.optional = (stOperation) => {
	v.required(stOperation, 'st_operation');
	return {
		fromByteBuffer(b) {
			if (!(b.readUint8() === 1)) {
				return undefined;
			}
			return stOperation.fromByteBuffer(b);
		},
		appendByteBuffer(b, object) {
			if (object !== null && object !== undefined) {
				b.writeUint8(1);
				stOperation.appendByteBuffer(b, object);
			} else {
				b.writeUint8(0);
			}

		},
		fromObject(object) {
			if (object === undefined) {
				return undefined;
			}
			return stOperation.fromObject(object);
		},
		toObject(object, debug = {}) {
			// toObject is only null save if use_default is true
			let resultObject = (() => {
				if (!debug.use_default && object === undefined) {
					return undefined;
				}
				return stOperation.toObject(object, debug);
			})();

			if (debug.annotate) {
				if (typeof resultObject === 'object') {
					resultObject.__optional = 'parent is optional';
				} else {
					resultObject = { __optional: resultObject };
				}
			}
			return resultObject;
		},
	};
};

Types.static_variant = (_stOperations) => ({
	nosort: true,
	st_operations: _stOperations,
	fromByteBuffer(b) {
		const typeId = b.readVarint32();
		const stOperation = this.st_operations[typeId];
		if (HEX_DUMP) {
			console.error(`static_variant id 0x${typeId.toString(16)} (${typeId})`);
		}
		v.required(stOperation, `operation ${typeId}`);
		return [
			typeId,
			stOperation.fromByteBuffer(b),
		];
	},
	appendByteBuffer(b, object) {
		v.required(object);
		const typeId = object[0];
		const stOperation = this.st_operations[typeId];
		v.required(stOperation, `operation ${typeId}`);
		b.writeVarint32(typeId);
		stOperation.appendByteBuffer(b, object[1]);

	},
	fromObject(object) {
		v.required(object);
		const typeId = object[0];
		const stOperation = this.st_operations[typeId];
		v.required(stOperation, `operation ${typeId}`);
		return [
			typeId,
			stOperation.fromObject(object[1]),
		];
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return [0, this.st_operations[0].toObject(undefined, debug)];
		}
		v.required(object);
		const typeId = object[0];
		const stOperation = this.st_operations[typeId];
		v.required(stOperation, `operation ${typeId}`);
		return [
			typeId,
			stOperation.toObject(object[1], debug),
		];
	},
});

Types.map = (keyStOperation, valueStOperation) => ({
	validate(array) {
		if (!Array.isArray(array)) {
			throw new Error('expecting array');
		}
		const dupMap = {};
		for (let i = 0; i < array.length; i += 1) {
			if (!(array[i].length === 2)) {
				throw new Error('expecting two elements');
			}

			if (['number', 'string'].indexOf(typeof array[i][0]) >= 0) {
				if (dupMap[array[i][0]] !== undefined) {
					throw new Error('duplicate (map)');
				}
				dupMap[array[i][0]] = true;
			}
		}
		return sortOperation(array, keyStOperation);
	},

	fromByteBuffer(b) {
		const result = [];
		const end = b.readVarint32();
		for (let i = 0; end > 0 ? i < end : i > end; i += 1) {
			result.push([
				keyStOperation.fromByteBuffer(b),
				valueStOperation.fromByteBuffer(b),
			]);
		}
		return this.validate(result);
	},

	appendByteBuffer(b, object) {
		this.validate(object);
		b.writeVarint32(object.length);
		for (let i = 0, o; i < object.length; i += 1) {
			o = object[i];
			keyStOperation.appendByteBuffer(b, o[0]);
			valueStOperation.appendByteBuffer(b, o[1]);
		}

	},
	fromObject(object) {
		v.required(object);
		const result = [];
		for (let i = 0, o; i < object.length; i += 1) {
			o = object[i];
			result.push([
				keyStOperation.fromObject(o[0]),
				valueStOperation.fromObject(o[1]),
			]);
		}
		return this.validate(result);
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return [
				[
					keyStOperation.toObject(undefined, debug),
					valueStOperation.toObject(undefined, debug),
				],
			];
		}
		v.required(object);
		object = this.validate(object);
		const result = [];
		for (let i = 0, o; i < object.length; i += 1) {
			o = object[i];
			result.push([
				keyStOperation.toObject(o[0], debug),
				valueStOperation.toObject(o[1], debug),
			]);
		}
		return result;
	},
});

Types.public_key = {
	toPublic(object) {
		if (object instanceof PublicKey) return object;
		if (object.resolve !== undefined) {
			object = object.resolve;
		}
		return PublicKey.fromStringOrThrow(object);
	},
	fromByteBuffer(b) {
		return fp.publicKey(b);
	},
	appendByteBuffer(b, object) {
		v.required(object);
		fp.publicKey(b, Types.public_key.toPublic(object));

	},
	fromObject(object) {
		v.required(object);
		if (object.Q) {
			return object;
		}
		return Types.public_key.toPublic(object);
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return `${ChainConfig.address_prefix}859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM`;
		}
		v.required(object);
		return object.toString();
	},
};

Types.address = {
	_to_address(object) {
		v.required(object);
		if (object.addy) {
			return object;
		}
		return Address.fromString(object);
	},
	fromByteBuffer(b) {
		return new Address(fp.ripemd160(b));
	},
	appendByteBuffer(b, object) {
		fp.ripemd160(b, Types.address._to_address(object).toBuffer());

	},
	fromObject(object) {
		return Types.address._to_address(object);
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return `${ChainConfig.address_prefix}664KmHxSuQyDsfwo4WEJvWpzg1QKdg67S`;
		}
		return Types.address._to_address(object).toString();
	},
	compare(a, b) {
		return strCmp(a.toString(), b.toString());
	},
};

Types.public_key_ecdsa = {
	toPublic(object) {
		if (object.resolve !== undefined) {
			object = object.resolve;
		}
		return !object || object.Q ? object : PublicKeyECDSA.fromStringOrThrow(object);
	},
	fromByteBuffer(b) {
		return fp.publicKey(b);
	},
	appendByteBuffer(b, object) {
		v.required(object);
		fp.publicKey(b, Types.public_key_ecdsa.toPublic(object));

	},
	fromObject(object) {
		v.required(object);
		if (object.Q) {
			return object;
		}
		return Types.public_key_ecdsa.toPublic(object);
	},
	toObject(object, debug = {}) {
		if (debug.use_default && object === undefined) {
			return `${ChainConfig.address_prefix_ecdsa}859gxfnXyUriMgUeThh1fWv3oqcpLFyHa3TfFYC4PK2HqhToVM`;
		}
		v.required(object);
		return object.toString();
	},
	compare(a, b) {
		return strCmp(a.toAddressString(), b.toAddressString());
	},
};

module.exports = Types;
