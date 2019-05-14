
/**
    Account names may contain one or more names separated by a dot.
    Each name needs to start with a letter and may contain
    numbers, or well placed dashes.
    @see is_valid_name graphene/libraries/chain/protocol/account.cpp
*/
const idRegex = /\b\d+\.\d+\.(\d+)\b/;

const chainValidation = {
	is_account_name: (value, allowShort = false) => {
		if (typeof value !== 'string') {
			return false;
		}

		if (chainValidation.is_empty(value)) {
			return false;
		}

		const { length } = value;

		if (length > 63) {
			return false;
		}

		const ref = value.split('.');

		for (let i = 0; i < ref.length; i += 1) {

			const label = ref[i];

			if (!(/^[a-z][a-z0-9-]*$/.test(label) && !/--/.test(label) && /[a-z0-9]$/.test(label))) {
				return false;
			}

		}
		return true;
	},


	is_object_id: (objId) => {
		if (typeof objId !== 'string') {
			return false;
		}

		const match = idRegex.exec(objId);
		return (match !== null && objId.split('.').length === 3);
	},

	is_empty: (value) => value == null || value.length === 0,

	is_account_name_error: (value, allowShort) => {
		if (allowShort == null) {
			allowShort = false;
		}
		let suffix = 'Account name should';
		if (chainValidation.is_empty(value)) {
			return `${suffix} not be empty.`;
		}

		if (!allowShort && value.length < 3) {
			return `${suffix} be longer.`;
		}

		if (value.length > 63) {
			return `${suffix} be shorter then 63 symbols.`;
		}

		if (/\./.test(value)) {
			suffix = 'Each account segment should';
		}

		const ref = value.split('.');

		for (let i = 0; i < ref.length; i += 1) {
			const label = ref[i];
			if (!/^[~a-z]/.test(label)) {
				return `${suffix} start with a latin letter.`;
			}
			if (!/^[~a-z0-9-]*$/.test(label)) {
				return `${suffix} have only latin letters, digits, or dashes.`;
			}
			if (/--/.test(label)) {
				return `${suffix} have only one dash in a row.`;
			}
			if (!/[a-z0-9]$/.test(label)) {
				return `${suffix} end with a latin letter or digit.`;
			}
			if (!(label.length >= 3)) {
				return `${suffix} be longer.`;
			}
		}
		return null;
	},

	is_cheap_name: (name) => /[0-9-]/.test(name) || !/[aeiouy]/.test(name),

	is_empty_user_input: (value) => {
		if (chainValidation.is_empty(value)) {
			return true;
		}
		if (String(value).trim() === '') {
			return true;
		}
		return false;
	},

	required: (value, fieldName = '') => {
		if (chainValidation.is_empty(value)) {
			throw new Error(`value required for ${fieldName}: ${value}`);
		}
		return value;
	},

	/** @see is_valid_symbol graphene/libraries/chain/protocol/asset_ops.cpp */
	is_valid_symbol_error: (value) => {
		const suffix = 'Asset name should';
		if (chainValidation.is_empty(value)) {
			return `${suffix} not be empty.`;
		}
		if (value.split('.').length > 2) {
			return `${suffix} have only one dot.`;
		}
		if (value.length < 3) {
			return `${suffix} be longer.`;
		}
		if (value.length > 16) {
			return `${suffix} be shorter.`;
		}
		if (!/^[A-Z]/.test(value)) {
			return `${suffix} start with a letter.`;
		}
		if (!/[A-Z]$/.test(value)) {
			return `${suffix} end with a letter.`;
		}
		if (/^[A-Z0-9.]$/.test(value)) {
			return `${suffix} contain only letters numbers and perhaps a dot.`;
		}
		return null;
	},
};

module.exports = chainValidation;
