import { Long } from 'bytebuffer';
import ChainTypes from '../../chain/src/ChainTypes';

const MAX_SAFE_INT = 9007199254740991;
const MIN_SAFE_INT = -9007199254740991;

/**
    Most validations are skipped and the value returned unchanged
	when an empty string, null, or undefined is encountered (except 'required').

    Validations support a string format for dealing with large numbers.
*/
const _my = {

	is_empty(value) {
		return value === null || value === undefined;
	},

	required(value, fieldName = '') {
		if (this.is_empty(value)) {
			throw new Error(`value required ${fieldName} ${value}`);
		}
		return value;
	},

	require_long(value, fieldName = '') {
		if (!Long.isLong(value)) {
			throw new Error(`Long value required ${fieldName} ${value}`);
		}
		return value;
	},

	string(value) {
		if (this.is_empty(value)) {
			return value;
		}
		if (typeof value !== 'string') {
			throw new Error(`string required: ${value}`);
		}
		return value;
	},

	number(value) {
		if (this.is_empty(value)) {
			return value;
		}
		if (typeof value !== 'number') {
			throw new Error(`number required: ${value}`);
		}
		return value;
	},

	whole_number(value, fieldName = '') {
		if (this.is_empty(value)) {
			return value;
		}
		if (/\./.test(value)) {
			throw new Error(`whole number required ${fieldName} ${value}`);
		}
		return value;
	},

	unsigned(value, fieldName = '') {
		if (this.is_empty(value)) {
			return value;
		}
		if (/-/.test(value)) {
			throw new Error(`unsigned required ${fieldName} ${value}`);
		}
		return value;
	},

	is_digits(value) {
		return /^[0-9]+$/.test(value);
	},

	to_number(value, fieldName = '') {
		if (this.is_empty(value)) {
			return value;
		}
		this.no_overflow53(value, fieldName);
		const intValue = (() => {
			if (typeof value === 'number') {
				return value;
			}

			return parseInt(value, 10);
		})();
		return intValue;
	},

	to_long(value, fieldName = '') {
		if (this.is_empty(value)) {
			return value;
		}
		if (Long.isLong(value)) {
			return value;
		}

		this.no_overflow64(value, fieldName);
		if (typeof value === 'number') {
			value = String(value);
		}
		return Long.fromString(value);
	},

	to_string(value, fieldName = '') {
		if (this.is_empty(value)) {
			return value;
		}
		if (typeof value === 'string') {
			return value;
		}
		if (typeof value === 'number') {
			this.no_overflow53(value, fieldName);
			return String(value);
		}
		if (Long.isLong(value)) {
			return value.toString();
		}

		throw new Error(`unsupported type ${fieldName}: (${typeof value}) ${value}`);
	},

	require_test(regex, value, fieldName = '') {
		if (this.is_empty(value)) {
			return value;
		}
		if (!regex.test(value)) {
			throw new Error(`unmatched ${regex} ${fieldName} ${value}`);
		}
		return value;
	},

	require_match(regex, value, fieldName = '') {
		if (this.is_empty(value)) {
			return value;
		}
		const match = value.match(regex);
		if (match === null) {
			throw new Error(`unmatched ${regex} ${fieldName} ${value}`);
		}
		return match;
	},

	require_object_id(value, fieldName) {
		return _my.require_match(
			/^([0-9]+)\.([0-9]+)\.([0-9]+)$/,
			value,
			fieldName,
		);
	},

	// Does not support over 53 bits
	require_range(min, max, value, fieldName = '') {
		if (this.is_empty(value)) {
			return value;
		}
		if (value < min || value > max) {
			throw new Error(`out of range ${value} ${fieldName} ${value}`);
		}
		return value;
	},

	require_object_type(
		reservedSpaces = 1, type, value,
		fieldName = '',
	) {
		if (this.is_empty(value)) {
			return value;
		}
		const objectType = ChainTypes.object_type[type];
		if (!objectType) {
			throw new Error(`Unknown object type ${type} ${fieldName} ${value}`);
		}
		const re = new RegExp(`${reservedSpaces}.${objectType}.[0-9]+$`);
		if (!re.test(value)) {
			throw new Error(`Expecting ${type} in format ${reservedSpaces}.${objectType}.[0-9]+ instead of ${value} ${fieldName} ${value}`);
		}
		return value;
	},

	get_instance(reserveSpaces, type, value, fieldName) {
		if (this.is_empty(value)) {
			return value;
		}
		this.require_object_type(reserveSpaces, type, value, fieldName);
		return this.to_number(value.split('.')[2]);
	},

	require_relative_type(type, value, fieldName) {
		this.require_object_type(0, type, value, fieldName);
		return value;
	},

	get_relative_instance(type, value, fieldName) {
		if (this.is_empty(value)) {
			return value;
		}
		this.require_object_type(0, type, value, fieldName);
		return this.to_number(value.split('.')[2]);
	},

	require_protocol_type(type, value, fieldName) {
		this.require_object_type(1, type, value, fieldName);
		return value;
	},

	get_protocol_instance(type, value, fieldName) {
		if (this.is_empty(value)) {
			return value;
		}
		this.require_object_type(1, type, value, fieldName);
		return this.to_number(value.split('.')[2]);
	},

	get_protocol_type(value, fieldName) {
		if (this.is_empty(value)) {
			return value;
		}
		this.require_object_id(value, fieldName);
		const values = value.split('.');
		return this.to_number(values[1]);
	},

	get_protocol_type_name(value, fieldName) {
		if (this.is_empty(value)) {
			return value;
		}
		const typeId = this.get_protocol_type(value, fieldName);
		return (Object.keys(ChainTypes.object_type))[typeId];
	},

	require_implementation_type(type, value, fieldName) {
		this.require_object_type(2, type, value, fieldName);
		return value;
	},

	get_implementation_instance(type, value, fieldName) {
		if (this.is_empty(value)) {
			return value;
		}
		this.require_object_type(2, type, value, fieldName);
		return this.to_number(value.split('.')[2]);
	},

	// signed / unsigned decimal
	no_overflow53(value, fieldName = '') {
		if (typeof value === 'number') {
			if (value > MAX_SAFE_INT || value < MIN_SAFE_INT) {
				throw new Error(`overflow ${fieldName} ${value}`);
			}
			return;
		}
		if (typeof value === 'string') {
			if (value > MAX_SAFE_INT || value < MIN_SAFE_INT) {
				throw new Error(`overflow ${fieldName} ${value}`);
			}
			return;
		}
		if (Long.isLong(value)) {
			// typeof value.toInt() is 'number'
			this.no_overflow53(value.toInt(), fieldName);
			return;
		}
		throw new Error(`unsupported type ${fieldName}: (${typeof value}) ${value}`);
	},

	// signed / unsigned whole numbers only
	no_overflow64(value, fieldName = '') {
		// https://github.com/dcodeIO/Long.js/issues/20
		if (Long.isLong(value)) {
			return;
		}

		// BigInteger#isBigInteger https://github.com/cryptocoinjs/bigi/issues/20
		if (value.t !== undefined && value.s !== undefined) {
			this.no_overflow64(value.toString(), fieldName);
			return;
		}

		if (typeof value === 'string') {
			// remove leading zeros, will cause a false positive
			value = value.replace(/^0+/, '');
			// remove trailing zeros
			while (/0$/.test(value)) {
				value = value.substring(0, value.length - 1);
			}
			if (/\.$/.test(value)) {
				// remove trailing dot
				value = value.substring(0, value.length - 1);
			}
			if (value === '') {
				value = '0';
			}
			const longString = Long.fromString(value).toString();
			if (longString !== value.trim()) {
				throw new Error(`overflow ${fieldName} ${value}`);
			}
			return;
		}
		if (typeof value === 'number') {
			if (value > MAX_SAFE_INT || value < MIN_SAFE_INT) {
				throw new Error(`overflow ${fieldName} ${value}`);
			}
			return;
		}

		throw new Error(`unsupported type ${fieldName}: (${typeof value}) ${value}`);
	},
};

export default _my;
