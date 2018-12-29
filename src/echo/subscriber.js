import {
	isFunction,
	isBoolean,
} from '../utils/validator';

class Subscriber {

	constructor(cache, api) {
		this.cache = cache;
		this.wsApi = api;
	}

	reset() {
		// TODO reset subscribers
	}

	/**
     *  @method setSubscribeCallback
     *  @param  {Function} callback
     *  @param  {Boolean} notifyRemoveCreate
     *
     *  @return {Promise}
     */
	setSubscribeCallback(callback, notifyRemoveCreate) {
		if (!isFunction(callback)) return Promise.reject(new Error('Callback should be a function'));
		if (!isBoolean(notifyRemoveCreate)) return Promise.reject(new Error('notifyRemoveCreate should be a boolean'));

		return this.wsApi.database.setSubscribeCallback(callback, notifyRemoveCreate);
	}

	/**
     *  @method setPendingTransactionCallback
     *  @param  {Function} callback
     *
     *  @return {Promise}
     */
	setPendingTransactionCallback(callback) {
		if (!isFunction(callback)) return Promise.reject(new Error('Callback should be a function'));
		return this.wsApi.database.setPendingTransactionCallback(callback);
	}

	/**
     *  @method setBlockAppliedCallback
     *  @param  {Function} callback
     *
     *  @return {Promise}
     */
	setBlockAppliedCallback(callback) {
		if (!isFunction(callback)) return Promise.reject(new Error('Callback should be a function'));
		return this.wsApi.database.setBlockAppliedCallback(callback);
	}

	/**
     *  @method cancelAllSubscriptions
     *
     *  @return {Promise}
     */
	cancelAllSubscriptions() {
		return this.wsApi.database.cancelAllSubscriptions();
	}

	/**
     *  @method subscribeToMarket
     *  @param  {Function} callback
     *  @param  {String} baseAssetId
     *  @param  {String} quoteAssetId
     *
     *  @return {Promise}
     */
	subscribeToMarket(callback, baseAssetId, quoteAssetId) {
		if (!isFunction(callback)) return Promise.reject(new Error('Callback parameter should be a function'));
		return this.wsApi.database.subscribeToMarket(callback, baseAssetId, quoteAssetId);
	}

	/**
     *  @method unsubscribeFromMarket
     *
     *  @param  {String} baseAssetName
     *  @param  {String} quoteAssetName
     *
     *  @return {Promise}
     */
	unsubscribeFromMarket(baseAssetName, quoteAssetName) {
		this.wsApi.database.unsubscribeFromMarket(baseAssetName, quoteAssetName);
	}

	/**
     *  @method subscribeContractLogs
     *
     *  @param  {Function} callback
     *  @param  {String} contractId
     *  @param  {Number} fromBlock
     *  @param  {Number} toBlock
     *
     *  @return {Promise}
     */
	subscribeContractLogs(callback, contractId, fromBlock, toBlock) {
		this.wsApi.database.subscribeContractLogs(callback, contractId, fromBlock, toBlock);
	}

}

export default Subscriber;
