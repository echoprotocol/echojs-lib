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
	 *  		witness: "witness-id",
	 *  		transaction_merkle_root: "merkle-root",
	 *  		state_root_hash: "hash",
	 *  		result_root_hash: "result-hash",
	 *  		witness_signature: "sig",
	 *  		ed_signature: "eddsa signature",
	 *  		verifications: [{witness-id, witness-signature}],
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
	broadcastTransactionWithCallback(callback, signedTransaction) {
		return this.db.exec('broadcast_transaction_with_callback', [callback, signedTransaction]);
	}

}

export default NetworkAPI;