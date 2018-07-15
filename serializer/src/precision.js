const BigInteger = require('bigi');
const v = require('./SerializerValidation');

// _internal is for low-level transaction code
const _internal = {
	// Warning: Long operations may over-flow without detection
	to_long64(numberOrString, precision, errorInfo = '') {
		v.required(numberOrString, `numberOrString ${errorInfo}`);
		v.required(precision, `precision ${errorInfo}`);
		return v.to_long(_internal.decimal_precision_string(
			numberOrString,
			precision,
			errorInfo,
		));
	},

	decimal_precision_string(number, precision, errorInfo = '') {
		v.required(number, `number ${errorInfo}`);
		v.required(precision, `precision ${errorInfo}`);

		let numberString = v.to_string(number);
		numberString = numberString.trim();
		precision = v.to_number(precision);

		// remove leading zeros (not suffixing)
		const numberParts = numberString.match(/^-?0*([0-9]*)\.?([0-9]*)$/);
		if (!numberParts) {
			throw new Error(`Invalid number: ${numberString} ${errorInfo}`);
		}

		let sign = numberString.charAt(0) === '-' ? '-' : '';
		let intPart = numberParts[1];
		let decimalPart = numberParts[2];
		if (!decimalPart) {
			decimalPart = '';
		}

		// remove trailing zeros
		while (/0$/.test(decimalPart)) {
			decimalPart = decimalPart.substring(0, decimalPart.length - 1);
		}

		const zeroPadCount = precision - decimalPart.length;
		if (zeroPadCount < 0) {
			throw new Error(`overflow, up to ${precision} decimals may be used ${errorInfo}`);
		}

		if (sign === '-' && !/[1-9]/.test(intPart + decimalPart)) {
			sign = '';
		}
		if (intPart === '') {
			intPart = '0';
		}
		for (let i = 0; zeroPadCount > 0 ? i < zeroPadCount : i > zeroPadCount; i += 1) {
			decimalPart += '0';
		}

		return sign + intPart + decimalPart;
	},
};

const _my = {
	// Result may be used for int64 types (like transfer amount).  Asset's
	// precision is used to convert the number to a whole number with an implied
	// decimal place.

	// '1.01' with a precision of 2 returns long 101
	// See http://cryptocoinjs.com/modules/misc/bigi/#example

	to_bigint64(numberOrString, precision, errorInfo = '') {
		const long = _internal.to_long64(numberOrString, precision, errorInfo);
		return BigInteger(long.toString());
	},

	// 101 string or long with a precision of 2 returns '1.01'
	to_string64(numberOrString, precision, errorInfo = '') {
		v.required(numberOrString, errorInfo);
		v.number(precision, errorInfo);
		const numberLong = v.to_long(numberOrString, errorInfo);
		const string64 = _internal.decimal_precision_string(
			numberLong,
			precision,
			errorInfo,
		);
		v.no_overflow64(string64, errorInfo);
		return string64;
	},

	_internal,
};

module.exports = _my;
