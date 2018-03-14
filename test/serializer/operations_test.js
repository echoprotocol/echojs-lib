import assert from "assert";
import ops from "../../lib/serializer/src/operations";

describe("operation test", function() {

	it("templates", function() {
		for (let op in ops) {
			switch (op) {
			case "operation": continue;
			}
			template(ops[op]);
		}
	});
});

function template(op) {

	assert(op.toObject({}, { use_default: true }));
	assert(op.toObject({}, { use_default: true, annotate: true }));

	// sample json
	let obj = op.toObject({}, { use_default: true, annotate: false });
	// console.log(" ", op.operation_name, "\t", JSON.stringify(obj), "\n")

}
