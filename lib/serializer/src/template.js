
/** Console print any transaction object with zero default values. */
export default function template(op) {

	let object = op.toObject(void 0, { use_default: true, annotate: true });

	// visual (with descriptions)
	console.error(JSON.stringify(object, null, 4));

	// usable in a copy-paste

	object = op.toObject(void 0, { use_default: true, annotate: false });

	// copy-paste one-lineer
	console.error(JSON.stringify(object));
}
