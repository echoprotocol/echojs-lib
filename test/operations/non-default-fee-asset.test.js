import { Echo, OPERATIONS_IDS } from "../..";
import { accountId, privateKey, url } from "../_test-data";
import { getRandomAssetSymbol } from "../_test-utils";
import { ok } from "assert";

/**
 * @typedef {import("../..")["serializers"]["protocol"]["asset"]["issue"]["__TOutput__"]} RawAssetIssueOperationProps
 */

describe("Non default fee asset", () => {
	const echo = new Echo();
	/** @type {string} */
	let assetId;
	before(async function () {
		this.timeout(30e3);
		await echo.connect(url);
		const assetCreationRes = await echo.createTransaction().addOperation(OPERATIONS_IDS.ASSET_CREATE, {
			bitasset_options: undefined,
			common_options: {
				blacklist_authorities: [],
				core_exchange_rate: {
					base: { asset_id: "1.3.0", amount: 10 },
					quote: { asset_id: "1.3.1", amount: 1 },
				},
				description: "",
				extensions: [],
				flags: 0,
				issuer_permissions: 15,
				max_supply: 1e15,
				whitelist_authorities: [],
			},
			extensions: [],
			fee: undefined,
			issuer: accountId,
			precision: 4,
			symbol: getRandomAssetSymbol(),
		}).addSigner(privateKey).broadcast();
		assetId = assetCreationRes[0].trx.operation_results[0][1];
		await echo.createTransaction().addOperation(OPERATIONS_IDS.ASSET_ISSUE, {
			asset_to_issue: { asset_id: assetId, amount: 1e5 },
			extensions: [],
			fee: undefined,
			issue_to_account: accountId,
			issuer: accountId,
		}).addSigner(privateKey).broadcast();
	});
	describe("when should succeed", () => {
		/** @type {ReturnType<Echo["createTransaction"]>} */
		let tx;
		before(() => tx = echo.createTransaction());
		it("creating operation should not rejects", () => {
			tx.addOperation(OPERATIONS_IDS.ASSET_ISSUE, {
				asset_to_issue: { asset_id: assetId, amount: 1e5 },
				extensions: [],
				fee: { asset_id: assetId },
				issue_to_account: accountId,
				issuer: accountId,
			});
		});
		it("required fees calculation should not rejects", async () => await tx.setRequiredFees());
		/** @type {RawAssetIssueOperationProps} */
		let operationProps;
		it("transaction should contains operation", () => {
			ok(tx.operations.length > 0);
			operationProps = tx.operations[0][1];
		});
		it("operation fee asset id should be equals to provided asset id", function () {
			if (operationProps === undefined) this.skip();
			else ok(operationProps.fee.asset_id === assetId);
		})
		it("calculated fee should not been equals to 0", function () {
			if (operationProps === undefined) this.skip();
			else ok(operationProps.fee.amount !== "0");
		});
		it("transaction signing should not rejects", async () => await tx.sign(privateKey));
		it("transaction broadcasting should not rejects", async () => await tx.broadcast()).timeout(15e3);
	});
});
