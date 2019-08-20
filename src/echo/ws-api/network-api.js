class NetworkAPI {

	/**
	 *  @constructor
	 *
	 *  @param {EchoApi} db [network api]
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 *  @method broadcastTransaction
	 *  Broadcast a transaction to the network.
	 *
	 *  @param  {Object} signedTransaction
	 *  	transaction: {
	 *  		ref_block_num,
	 *  		ref_block_prefix,
	 *  		operations,
	 *  		signatures,
	 *  	}
	 *
	 *  @return {Promise}
	 */
	broadcastTransaction(signedTransaction) {
		return this.db.exec('broadcast_transaction', [signedTransaction]);
	}

	/**
	 *  @method broadcastBlock
	 *  Broadcast a block to the network.
	 *
	 *  @param  {Object} signedBlock
	 *  	block: {
	 *  		previous: previous-block-id,
	 *  		timestamp: block-timestamp,
	 *  		transaction_merkle_root: "merkle-root",
	 *  		state_root_hash: "hash",
	 *  		result_root_hash: "result-hash",
	 *  		ed_signature: "eddsa signature",
	 *  		round: round-id,
	 *  		rand: rand,
	 *  		cert: "certificate",
	 *  		transactions: [{ref_block_num, ref_block_prefix, operations, signatures}],
	 *  	}
	 *
	 *  @return {Promise}
	 */
	broadcastBlock(signedBlock) {
		return this.db.exec('broadcast_block', [signedBlock]);
	}

	/**
	 *  @method broadcastTransactionSynchronous
	 *  Synchronious version of broadcastTransaction
	 *
	 *  @param  {Object} signedTransaction
	 *  	transaction: {
	 *  		ref_block_num,
	 *  		ref_block_prefix,
	 *  		operations,
	 *  		signatures,
	 *  	}
	 *
	 *  @return {Promise}
	 */
	broadcastTransactionSynchronous(signedTransaction) {
		return this.db.exec('broadcast_transaction_synchronous', [signedTransaction]);
	}

	/**
	 *  @method broadcastTransactionWithCallback
	 *  This version of broadcastTransaction registers a callback method
	 *  that will be called when the transaction is included into a block.
	 *
	 *  @param {Function} callback
	 *  @param  {Object} signedTransaction
	 *  	transaction: {
	 *  		ref_block_num,
	 *  		ref_block_prefix,
	 *  		operations,
	 *  		signatures,
	 *  	}
	 *
	 *  @return {Promise}
	 */
	async broadcastTransactionWithCallback(callback, signedTransaction) {
		console.log('NETWORK-API broadcastTransactionWithCallback BEFORE');
		/*return*/const check = await this.db.exec('broadcast_transaction_with_callback', [callback, signedTransaction]);
		console.log('NETWORK-API broadcastTransactionWithCallback AFTER');
		return check;
	}

}

export default NetworkAPI;
