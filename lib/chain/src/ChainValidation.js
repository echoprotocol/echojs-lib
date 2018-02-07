

/**
    Account names may contain one or more names separated by a dot.
    Each name needs to start with a letter and may contain
    numbers, or well placed dashes.
    @see is_valid_name graphene/libraries/chain/protocol/account.cpp
*/
let id_regex = /\b\d+\.\d+\.(\d+)\b/;

var chainValidation = {
	is_account_name: function (value, allow_too_short = false) {
		var i, label, len, length, ref;

		if (this.is_empty(value)) {
			return false;
		}

		length = value.length;

		if ((!allow_too_short && length < 3) || length > 63) {
			return false;
		}

		ref = value.split(".");

		for (i = 0, len = ref.length; i < len; i++) {

			label = ref[i];

			if (!(/^[a-z][a-z0-9-]*$/.test(label) && !/--/.test(label) && /[a-z0-9]$/.test(label))) {
				return false;
			}

		}
		return true;
	},


	is_object_id: function (obj_id) {
		if ("string" != typeof obj_id)
			{return false;}

		let match = id_regex.exec(obj_id);
		return (match !== null && obj_id.split(".").length === 3);
	},

	is_empty: function (value) {
		return value == null || value.length === 0;
	},

	is_account_name_error: function (value, allow_too_short) {
		var i, label, len, length, ref, suffix;
		if (allow_too_short == null) {
			allow_too_short = false;
		}
		suffix = "Account name should ";
		if (this.is_empty(value)) {
			return suffix + "not be empty.";
		}
		length = value.length;
		if (!allow_too_short && length < 3) {
			return suffix + "be longer.";
		}
		if (length > 63) {
			return suffix + "be shorter.";
		}
		if (/\./.test(value)) {
			suffix = "Each account segment should ";
		}
		ref = value.split(".");
		for (i = 0, len = ref.length; i < len; i++) {
			label = ref[i];
			if (!/^[~a-z]/.test(label)) {
				return suffix + "start with a letter.";
			}
			if (!/^[~a-z0-9-]*$/.test(label)) {
				return suffix + "have only letters, digits, or dashes.";
			}
			if (/--/.test(label)) {
				return suffix + "have only one dash in a row.";
			}
			if (!/[a-z0-9]$/.test(label)) {
				return suffix + "end with a letter or digit.";
			}
			if (!(label.length >= 3)) {
				return suffix + "be longer";
			}
		}
		return null;
	},

	is_cheap_name: function (account_name) {
		return /[0-9-]/.test(account_name) || !/[aeiouy]/.test(account_name);
	},

	is_empty_user_input: function (value) {
		if (this.is_empty(value)) { return true; }
		if ((value + "").trim() === "") { return true; }
		return false;
	},

	required: function (value, field_name = "") {
		if (this.is_empty(value)) {
			throw new Error("value required for " + field_name + ": " + value);
		}
		return value;
	},

	/** @see is_valid_symbol graphene/libraries/chain/protocol/asset_ops.cpp */
	is_valid_symbol_error: function (value) {
		var suffix = "Asset name should ";
		if (this.is_empty(value)) { return suffix + "not be empty."; }
		if (value.split(".").length > 2) { return suffix + "have only one dot."; }
		if (value.length < 3) { return suffix + "be longer."; }
		if (value.length > 16) { return suffix + "be shorter."; }
		if (!/^[A-Z]/.test(value)) { return suffix + "start with a letter"; }
		if (!/[A-Z]$/.test(value)) { return suffix + "end with a letter"; }
		if (/^[A-Z0-9\.]$/.test(value)) { return suffix + "contain only letters numbers and perhaps a dot."; }
		return null;
	}
};

export default chainValidation;
