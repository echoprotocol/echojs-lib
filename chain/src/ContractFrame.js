const { Apis } = require('echojs-ws');
const TransactionBuilder = require('./TransactionBuilder');

class ContractFrame {

	/**
	 *  @method {Function} getContractConstant
	 *
	 *  @param  {String} contractId
	 *  @param  {String} accountId
	 *  @param  {String} assetId
	 *  @param  {String} bytecode
	 */
	getContractConstant(contractId, accountId, assetId, bytecode) {
		return Apis.instance().dbApi().exec('call_contract_no_changing_state', [
			contractId,
			accountId,
			assetId,
			bytecode,
		]);
	}

	/**
	 *  @method {Function} getContractResult
	 *
	 *  @param  {String} resultId
	 */
	getContractResult(resultId) {
		return Apis.instance().dbApi().exec('get_contract_result', [resultId]);
	}

	/**
	 *  @method {Function} getContractInfo
	 *
	 *  @param  {String} contractId
	 */
	getContractInfo(contractId) {
		return Apis.instance().dbApi().exec('get_contract', [contractId]);
	}

	/**
	 *  @method {Function} callContract
	 *
	 *  @param {String} accountId - required
	 *  @param {String} contractId - required
	 *  @param {String} bytecode - required
	 *  @param {String} feeAssetId - optional (default = '1.3.0')
	 *  @param {Number} amount - optional (default = 0)
	 *  @param  {PrivateKey} privateKey
	 */
	callContract({
		accountId, contractId, bytecode, feeAssetId, amount,
	}, privateKey) {

		const options = {
			registrar: accountId,
			receiver: contractId,
			code: bytecode,
			asset_id: feeAssetId || '1.3.0',
			value: amount || 0,
		};

		const tr = new TransactionBuilder();
		tr.add_type_operation('contract', options);

		return tr.set_required_fees(options.asset_id).then(() => {
			tr.add_signer(privateKey);
			return tr.broadcast();
		});
	}

	/**
	 *  @method {Function} deployContract
	 *
	 *  @param {String} accountId - required
	 *  @param {String} bytecode - required
	 *  @param {String} feeAssetId - optional (default = '1.3.0')
	 *  @param  {PrivateKey} privateKey
	 */
	deployContract({
		accountId, bytecode, feeAssetId,
	}, privateKey) {

		const options = {
			registrar: accountId,
			value: { amount: 0, asset_id: '1.3.0' },
			code: bytecode,
			eth_accuracy: false,
			supported_asset_id: feeAssetId || '1.3.0',
		};

		const tr = new TransactionBuilder();
		tr.add_type_operation('create_contract', options);
		return tr.set_required_fees(options.asset_id).then(() => {
			tr.add_signer(privateKey);
			return tr.broadcast();
		});
	}

}

module.exports = ContractFrame;
