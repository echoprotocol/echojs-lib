import { START_OPERATION_ID } from '../../constants';

/** @typedef {import("../../../types/interfaces/chain").OperationHistoryObject} OperationHistoryObject */
/** @typedef {import("../../serializers/basic/integers")} Integer_t */
/** @typedef {import("../../serializers/chain/id/protocol")["contractId"]["__TOutput__"]} ContractId */

class HistoryAPI {

	/**
	 *  @constructor
	 *  @param {EchoApi} db [history api]
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 *  @method getAccountHistory
	 *  Get operations relevant to the specificed account.
	 *
	 *  @param {String} accountId
	 *  @param {String} stop [Id of the earliest operation to retrieve]
	 *  @param {Number} limit     [count operations (max 100)]
	 *  @param {String} start [Id of the most recent operation to retrieve]
	 *
	 *  @return {Promise}
	 */
	getAccountHistory(accountId, stop = START_OPERATION_ID, limit = 100, start = START_OPERATION_ID) {
		return this.db.exec('get_account_history', [accountId, stop, limit, start]);
	}

	/**
	 *  @method getRelativeAccountHistory
	 *  Get operations relevant to the specified account referenced
	 *  by an event numbering specific to the account.
	 *
	 *  @param {String} accountId
	 *  @param {Number} stop [Sequence number of earliest operation]
	 *  @param {Number} limit     [count operations (max 100)]
	 *  @param {Number} start [Sequence number of the most recent operation to retrieve]
	 *
	 *  @return {Promise}
	 */
	getRelativeAccountHistory(accountId, stop = 0, limit = 100, start = 0) {
		return this.db.exec('get_relative_account_history', [accountId, stop, limit, start]);
	}

	/**
	 *  @method getAccountHistoryOperations
	 *  Get only asked operations relevant to the specified account.
	 *
	 *  @param {String} accountId
	 *  @param {String} operationId
	 *  @param {Number} start [Id of the most recent operation to retrieve]
	 *  @param {Number} stop [Id of the earliest operation to retrieve]
	 *  @param {Number} limit     [count operations (max 100)]
	 *
	 *  @return {Promise}
	 */
	getAccountHistoryOperations(
		accountId, operationId,
		start = START_OPERATION_ID, stop = START_OPERATION_ID, limit = 100,
	) {
		return this.db.exec('get_account_history_operations', [accountId, operationId, start, stop, limit]);
	}

	/**
	 *  @method getContractHistory
	 *  Get operations relevant to the specificed account.
	 *
	 *  @param {String} contractId
	 *  @param {String} stop [Id of the earliest operation to retrieve]
	 *  @param {Number} limit     [count operations (max 100)]
	 *  @param {String} start [Id of the most recent operation to retrieve]
	 *
	 *  @return {Promise}
	 */
	getContractHistory(
		contractId,
		stop = START_OPERATION_ID, limit = 100, start = START_OPERATION_ID,
	) {
		return this.db.exec('get_contract_history', [contractId, stop, limit, start]);
	}

	/**
	 * @param {ContractId} contract
	 * @param {Integer_t["uint64"]["__TOutput__"]} stop
	 * @param {Integer_t["uint32"]["__TOutput__"]} limit
	 * @param {Integer_t["uint64"]["__TOutput__"]} start
	 * @returns {Promise<OperationHistoryObject[]>}
	 */
	getRelativeContractHistory(contract, stop, limit, start) {
		return this.db.exec('get_relative_contract_history', [contract, stop, limit, start]);
	}

}

export default HistoryAPI;
