var _my;

import v from "./SerializerValidation";
import BigInteger from "bigi";

// _internal is for low-level transaction code
const _internal = {
	// Warning: Long operations may over-flow without detection
	to_long64(number_or_string, precision, error_info = "") {
		v.required(number_or_string, "number_or_string " + error_info);
		v.required(precision, "precision " + error_info);
		return v.to_long(_internal.decimal_precision_string(
			number_or_string,
			precision,
			error_info
		));
	},

	decimal_precision_string(number, precision, error_info = "") {
		v.required(number, "number " + error_info);
		v.required(precision, "precision " + error_info);

		let number_string = v.to_string(number);
		number_string = number_string.trim();
		precision = v.to_number(precision);

		// remove leading zeros (not suffixing)
		let number_parts = number_string.match(/^-?0*([0-9]*)\.?([0-9]*)$/);
		if (!number_parts) {
			throw new Error(`Invalid number: ${number_string} ${error_info}`);
		}

		let sign = number_string.charAt(0) === "-" ? "-" : "";
		let int_part = number_parts[1];
		let decimal_part = number_parts[2];
		if (!decimal_part) {
			decimal_part = ""; 
		}

		// remove trailing zeros
		while (/0$/.test(decimal_part)) {
			decimal_part = decimal_part.substring(0, decimal_part.length - 1);
		}

		let zero_pad_count = precision - decimal_part.length;
		if (zero_pad_count < 0) {
			throw new Error(`overflow, up to ${precision} decimals may be used ${error_info}`);
		}

		if (sign === "-" && !/[1-9]/.test(int_part + decimal_part)) {
			sign = ""; 
		}
		if (int_part === "") {
			int_part = "0"; 
		}
		for (let i = 0; 0 < zero_pad_count ? i < zero_pad_count : i > zero_pad_count; 0 < zero_pad_count ? i++ : i++) {
			decimal_part += "0";
		}

		return sign + int_part + decimal_part;
	}
};

_my = {
	// Result may be used for int64 types (like transfer amount).  Asset's
	// precision is used to convert the number to a whole number with an implied
	// decimal place.

	// "1.01" with a precision of 2 returns long 101
	// See http://cryptocoinjs.com/modules/misc/bigi/#example

	to_bigint64(number_or_string, precision, error_info = "") {
		let long = _internal.to_long64(number_or_string, precision, error_info);
		return BigInteger(long.toString());
	},

	// 101 string or long with a precision of 2 returns "1.01"
	to_string64(number_or_string, precision, error_info = "") {
		v.required(number_or_string, error_info);
		v.number(precision, error_info);
		let number_long = v.to_long(number_or_string, error_info);
		let string64 = _internal.decimal_precision_string(
			number_long,
			precision,
			error_info
		);
		v.no_overflow64(string64, error_info);
		return string64;
	},

	_internal
};

export default _my;
