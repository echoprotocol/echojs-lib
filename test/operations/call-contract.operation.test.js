import "mocha";
// import { Echo, OPERATIONS_IDS } from "../../src/index";
import { Echo } from "../../src/index";
import { options } from "./create-contract.operation.test";

describe('call contract', () => {

	/** @type {import("../../types/index").Echo} */
	const echo = new Echo();

	before(() => echo.connect(options.netAddress));

	after(() => echo.disconnect());

	// it('successful', async () => {
	// 	echo.createTransaction().addOperation(OPERATIONS_IDS.CALL_CONTRACT, {
	// 		callee: options.contractAddress,
	// 		// ...
	// 	});
	// });

});
