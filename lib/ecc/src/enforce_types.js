import { Buffer } from "buffer";

const enforcer = {
	"Array": (e) => Array.isArray(e),
	"Buffer": (e) => Buffer.isBuffer(e),
};

export default function enforce(type, value) {
	if (enforcer[type] && enforcer[type](value)) {
		return;
	}
	if (typeof value === type.toLowerCase) {
		return;
	}
	if (getName(value.constructor) === getName(type)) {
		return;
	}
	throw new TypeError("Expected " + (getName(type) || type) + ", got " + value);
}

function getName(fn) {
	// Why not fn.name: https://kangax.github.io/compat-table/es6/#function_name_property
	let match = fn.toString().match(/function (.*?)\(/);
	return match ? match[1] : null;
}
