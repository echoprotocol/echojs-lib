import Transaction from '../echo/transaction';
import Result from './ContractResult';

/** @typedef {import("../../types/interfaces/Abi").AbiArgument} AbiArgument */
/** @typedef {import("../../types/echo/transaction").OPERATION_RESULT} OPERATION_RESULT */
/** @typedef {import('../../types/echo/transaction').OPERATION_RESULT_VARIANT} OPERATION_RESULT_VARIANT */

export default class ContractTransaction extends Transaction {

	/**
	 * @param {import("../echo/index").echo['api']} api
	 * @param {import("./Method").default} method
	 */
	constructor(api, method) {
		super(api);
		/**
		 * @private
		 * @type {import("./Method").default}
		 */
		this._method = method;
	}

	/**
	 * @param {() => any} [wasBroadcastedCallback]
	 * @returns {Promise<Result>}
	 */
	async broadcast(wasBroadcastedCallback) {
		const transactionResult = await super.broadcast(wasBroadcastedCallback);
		/** @type {string} */
		const opResId = transactionResult[0].trx.operation_results[0][1];
		const [, contractResult] = await this.api.getContractResult(opResId);
		return new Result(this._method, transactionResult, contractResult);
	}

}
