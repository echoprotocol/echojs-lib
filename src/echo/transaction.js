/* eslint-disable no-restricted-syntax */
import { cloneDeep } from 'lodash';

import Echo from './index';
import { Operations } from '../serializer/operations';
import { isString, isObject } from '../utils/validator';
import BigNumber from 'bignumber.js';

/** @typedef {[number,{[key:string]:any}]} Operation */

class Transaction {

	/**
	 * @readonly
	 * @type {Array<Operation>}
	 */
	get operations() { return cloneDeep(this._operations); }

	/** @type {Echo} */
	get echo() { return this._echo; }

	set echo(value) {
		if (!(value instanceof Echo)) throw new Error('value is not instance of Echo');
		/**
		 * @private
		 * @type {Echo}
		 */
		this._echo = value;
	}

	/** @param {Echo} echo */
	constructor(echo) {
		this.echo = echo;
		/**
		 * @private
		 * @type {Array<Operation>}
		 */
		this._operations = [];
	}

	/**
	 * @param {string} name
	 * @param {{[key:string]:any}} [props]
	 * @returns {Transaction}
	 */
	addOperation(name, props = {}) {
		// TODO: check finalization
		if (name === undefined) throw new Error('name is missing');
		if (!isString(name)) throw new Error('name is not a string');
		if (!isObject(props)) throw new Error('argument "props" is not a object');
		const operationType = Operations[name];
		if (!operationType) throw new Error(`unknown operation ${name}`);
		// TODO: proposal_create
		const operation = [operationType.id, props];
		if (!operationType.validate(operation, { feeIsRequired: false })) throw new Error('invalid props');
		this._operations.push(operation);
		return this;
	}

	/**
	 * @param {string} [assetId='1.3.0']
	 * @returns {Promise<void>}
	 */
	async setRequiredFees(assetId = '1.3.0') {
		const operations = this._operations;
		// TODO: check finalization
		if (operations.length === 0) throw new Error('no operations');
		/** @type Map<string,Array<Operation>> */
		const operationsByNotDefaultFee = new Map();
		const defaultAssetOperations = [];
		const addOperationToAsset = (notDefaultAssetId, operation) => {
			if (notDefaultAssetId === '1.3.0') {
				defaultAssetOperations.push(operation);
				return;
			}
			const arr = operationsByNotDefaultFee.get(notDefaultAssetId);
			if (!arr) operationsByNotDefaultFee.set(notDefaultAssetId, [operation]);
			else arr.push(operation);
		};
		for (const op of operations) {
			if (op[1].fee === undefined) addOperationToAsset(assetId, op);
			else if (op[1].fee.amount === undefined) addOperationToAsset(op[1].fee.assetId, op);
		}
		const notDefaultAssetsIds = [...operationsByNotDefaultFee.keys()];
		await Promise.all([
			(async () => {
				if (defaultAssetOperations.length === 0) return;
				const fees = await this.echo.api.getRequiredFees(defaultAssetOperations);
				for (let opIndex = 0; opIndex < fees.length; opIndex += 1) {
					const fee = fees[opIndex];
					defaultAssetOperations[opIndex][1].fee = { assetId: fee.asset_id, amount: fee.amount };
				}
			})(),
			...notDefaultAssetsIds.map(async (notDefaultAssetId) => {
				const ops = operationsByNotDefaultFee.get(notDefaultAssetId);
				/** @type {Array<{asset_id:string, amount:number}>} */
				const [fees, feePool] = await Promise.all([
					this.echo.api.getRequiredFees(ops, notDefaultAssetId),
					this.echo.api.getFeePool(notDefaultAssetId),
				]);
				const totalFees = new BigNumber(0);
				for (let opIndex = 0; opIndex < fees.length; opIndex += 1) {
					const fee = fees[opIndex];
					ops[opIndex][1].fee = { assetId: fee.asset_id, amount: fee.amount };
					totalFees.plus(fee.amount);
				}
				if (totalFees.gt(feePool)) throw new Error('fee pool overflow');
			}),
		]);
		return this;
	}

}

export default Transaction;
