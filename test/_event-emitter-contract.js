import assert from "assert";
import { OPERATIONS_IDS } from "..";
import { accountId, privateKey } from "./_test-data";

/** @typedef {import("..").Echo} Echo */

/*
 * pragma solidity ^0.4.23;
 * 
 * contract Emitter {
 *     event Event1(uint256 indexed indexedField, uint256 nonIndexedField);
 *     event Event2(uint256 indexed indexedField, uint256 nonIndexedField);
 *     function emit1(uint256 indexedField, uint256 nonIndexedField) public {
 *         emit Event1(indexedField, nonIndexedField);
 *     }
 *     function emit2(uint256 indexedField, uint256 nonIndexedField) public {
 *         emit Event2(indexedField, nonIndexedField);
 *     }
 * }
 */
const bytecode = [
	"608060405234801561001057600080fd5b50610163806100206000396000f30060806040526004361061004c576000357c010000000000000",
	"0000000000000000000000000000000000000000000900463ffffffff168063156d44ef146100515780631baea0ab14610088575b600080fd",
	"5b34801561005d57600080fd5b5061008660048036038101908080359060200190929190803590602001909291905050506100bf565b005b3",
	"4801561009457600080fd5b506100bd60048036038101908080359060200190929190803590602001909291905050506100fb565b005b817f",
	"d3610b1c54575b7f4f0dc03d210b8ac55624ae007679b7a928a4f25a709331a8826040518082815260200191505060405180910390a250505",
	"65b817f6a822560072e19c1981d3d3bb11e5954a77efa0caf306eb08d053f37de0040ba826040518082815260200191505060405180910390",
	"a250505600a165627a7a72305820fddab02616eb79d169bffcec273868d1795db6ede88d13a007343987fa332a370029",
].join("");

export const emit1 = "156d44ef";
export const emit2 = "1baea0ab";

/**
 * @param {Echo} echo
 * @param {number} [expirationOffset]
 * @returns {Promise<string>}
 */
export async function deploy(echo, expirationOffset = 0) {
	const tx = echo.createTransaction().addOperation(OPERATIONS_IDS.CONTRACT_CREATE, {
		registrar: accountId,
		value: { amount: 0, asset_id: "1.3.0" },
		code: bytecode,
		eth_accuracy: false,
		extensions: [],
	}).addSigner(privateKey);
	tx.expiration = Math.ceil(Date.now() / 1e3) + expirationOffset;
	const txRes = await tx.broadcast();
	/** @type {string} */
	const opResId = txRes[0].trx.operation_results[0][1];
	const opRes = await echo.api.getObject(opResId);
	const contractId = opRes.contracts_id[0];
	assert.ok(contractId !== undefined);
	return contractId;
}

/**
 * @param {Echo} echo
 * @param {string} contractId
 * @param {(typeof emit1)|(typeof emit2)} methodSignature
 * @param {number} indexed
 * @param {number} notIndexed
 */
export async function emit(echo, contractId, methodSignature, indexed, notIndexed) {
	assert.ok(indexed >= 0);
	assert.ok(notIndexed >= 0);
	assert.ok(Number.isSafeInteger(indexed));
	assert.ok(Number.isSafeInteger(notIndexed));
	await echo.createTransaction().addOperation(OPERATIONS_IDS.CONTRACT_CALL, {
		registrar: accountId,
		value: { amount: 0, asset_id: '1.3.0' },
		code: [
			methodSignature,
			indexed.toString(16).padStart(64, '0'),
			notIndexed.toString(16).padStart(64, '0'),
		].join(''),
		callee: contractId,
		extensions: [],
	}).addSigner(privateKey).broadcast();
}
