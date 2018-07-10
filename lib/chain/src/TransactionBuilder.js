/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */

import assert from 'assert';
import { Apis, ChainConfig } from 'echojs-ws';
import { Signature, PublicKey, hash } from '../../ecc';
import { ops } from '../../serializer';

import ChainTypes from './ChainTypes';

let headBlockTimeString;
let	committeeMinReview;

const { DEBUG } = process.env;


function timeStringToDate(time_string) {
	if (!time_string) {
		return new Date('1970-01-01T00:00:00.000Z');
	}
	// does not end in Z
	// https://github.com/cryptonomex/graphene/issues/368
	if (!/Z$/.test(time_string)) {
		time_string += 'Z';
	}
	return new Date(time_string);
}

function getHeadBlockDate() {
	return timeStringToDate(headBlockTimeString);
}

const base_expiration_sec = () => {
	const head_block_sec = Math.ceil(getHeadBlockDate().getTime() / 1000);
	const now_sec = Math.ceil(Date.now() / 1000);
	// The head block time should be updated every 3 seconds.  If it isn't
	// then help the transaction to expire (use head_block_sec)
	if (now_sec - head_block_sec > 30) {
		return head_block_sec;
	}
	// If the user's clock is very far behind, use the head block time.
	return Math.max(now_sec, head_block_sec);
};

function _broadcast(was_broadcast_callback) {
	return new Promise((resolve, reject) => {

		if (!this.signed) {
			this.sign();
		}
		if (!this.tr_buffer) {
			throw new Error('not finalized');
		}
		if (!this.signatures.length) {
			throw new Error('not signed');
		}
		if (!this.operations.length) {
			throw new Error('no operations');
		}

		const tr_object = ops.signed_transaction.toObject(this);
		// console.log('... broadcast_transaction_with_callback !!!')
		Apis.instance().network_api().exec('broadcast_transaction_with_callback', [function (res) {
			return resolve(res);
		}, tr_object]).then(() => {
			// console.log('... broadcast success, waiting for callback')
			if (was_broadcast_callback) {
				was_broadcast_callback();
			}

		})
			.catch((error) => {
				// console.log may be redundant for network errors, other errors could occur
				console.log(error);
				let { message } = error;
				if (!message) {
					message = '';
				}
				reject(new Error((
					`${message}\n` +
					'echo-crypto ' +
					` digest ${hash.sha256(this.tr_buffer).toString('hex')
					} transaction ${this.tr_buffer.toString('hex')
					} ${JSON.stringify(tr_object)}`)));

			});

	});
}

class TransactionBuilder {

	constructor() {
		this.ref_block_num = 0;
		this.ref_block_prefix = 0;
		this.expiration = 0;
		this.operations = [];
		this.signatures = [];
		this.signer_private_keys = [];

		// semi-private method bindings
		this._broadcast = _broadcast.bind(this);
	}

	/**
        @arg {string} name - like "transfer"
        @arg {object} operation - JSON matchching the operation's format
    */
	add_type_operation(name, operation) {
		this.add_operation(this.get_type_operation(name, operation));

	}

	/**
        This does it all: set fees, finalize, sign, and broadcast (if wanted).

        @arg {ConfidentialWallet} cwallet - must be unlocked, used to gather signing keys

        @arg {array<string>} [signer_pubkeys = null] - Optional ["GPH1Abc9Def0...", ...].
		These are additional signing keys.
		Some balance claims require propritary address formats,
		the witness node can't tell us which ones are needed so they must be passed in.
		If the witness node can figure out a signing key (mostly all other transactions),
		it should not be passed in here.

        @arg {boolean} [broadcast = false]
    */
	process_transaction(cwallet, signer_pubkeys = null, broadcast = false) {
		const { wallet_object } = cwallet.wallet;
		if (Apis.instance().chain_id !== wallet_object.get('chain_id')) {
			const error = `Mismatched chain_id; expecting ${wallet_object.get('chain_id')}, but got ${Apis.instance().chain_id}`;

			return Promise.reject(new Error(error));
		}
		return this.set_required_fees().then(() => {
			const signer_pubkeys_added = {};
			if (signer_pubkeys) {

				// Balance claims are by address, only the private
				// key holder can know about these additional
				// potential keys.
				const pubkeys = cwallet.getPubkeys_having_PrivateKey(signer_pubkeys);
				if (!pubkeys.length) {
					throw new Error('Missing signing key');
				}

				for (const pubkey_string of pubkeys) {
					const private_key = cwallet.getPrivateKey(pubkey_string);
					this.add_signer(private_key, pubkey_string);
					signer_pubkeys_added[pubkey_string] = true;
				}
			}

			return this.get_potential_signatures().then(({ pubkeys, addys }) => {
				const my_pubkeys = cwallet.getPubkeys_having_PrivateKey(pubkeys, addys);

				// {//Testing only, don't send All public keys!
				// 	let pubkeys_all = PrivateKeyStore.getPubkeys() // All public keys
				// 	this.get_required_signatures(pubkeys_all).then(required_pubkey_strings =>
				// 		console.log(
				// 			'get_required_signatures all\t',
				// 			required_pubkey_strings.sort(),
				// 			pubkeys_all
				// 		)
				// 	);
				// 	this.get_required_signatures(my_pubkeys).then(required_pubkey_strings =>
				// 		console.log(
				// 			'get_required_signatures normal\t',
				// 			required_pubkey_strings.sort(),
				// 			pubkeys
				// 		)
				// 	);
				// }

				return this.get_required_signatures(my_pubkeys).then((required_pubkeys) => {
					for (const pubkey_string of required_pubkeys) {
						if (!signer_pubkeys_added[pubkey_string]) {
							const private_key = cwallet.getPrivateKey(pubkey_string);
							if (!private_key) {
								// This should not happen, get_required_signatures will only
								// returned keys from my_pubkeys
								throw new Error(`Missing signing key for ${pubkey_string}`);
							}
							this.add_signer(private_key, pubkey_string);
						}
					}
				});
			})
				.then(() => (broadcast ? this.broadcast() : this.serialize()));
		});
	}

	/**
	 *  Typically this is called automatically just prior to signing.
	 *	Once finalized this transaction can not be changed.
	 */
	finalize() {
		return new Promise((resolve, reject) => {

			if (this.tr_buffer) {
				reject(new Error('already finalized'));
			}

			resolve(Apis.instance().dbApi().exec('get_objects', [['2.1.0']]).then((r) => {
				headBlockTimeString = r[0].time;
				if (this.expiration === 0) {
					this.expiration = base_expiration_sec() + ChainConfig.expire_in_secs;
				}
				this.ref_block_num = r[0].head_block_number && 0xFFFF;
				this.ref_block_prefix = Buffer.from(r[0].head_block_id, 'hex').readUInt32LE(4);
				if (DEBUG) {
					console.log('ref_block', this.ref_block_num, this.ref_block_prefix, r);
				}

				const iterable = this.operations;
				for (let i = 0, op; i < iterable.length; i += 1) {
					op = iterable[i];
					if (op[1].finalize) {
						op[1].finalize();
					}
				}
				this.tr_buffer = ops.transaction.toBuffer(this);

			}));

		});
	}

	/** @return {string} hex transaction ID */
	id() {
		if (!this.tr_buffer) {
			throw new Error('not finalized');
		}
		return hash.sha256(this.tr_buffer).toString('hex').substring(0, 40);
	}

	/**
        Typically one will use {@link this.add_type_operation} instead.
        @arg {array} operation - [operation_id, operation]
    */
	add_operation(operation) {
		if (this.tr_buffer) {
			throw new Error('already finalized');
		}
		assert(operation, 'operation');
		if (!Array.isArray(operation)) {
			throw new Error('Expecting array [operation_id, operation]');
		}
		this.operations.push(operation);

	}

	get_type_operation(name, operation) {
		if (this.tr_buffer) {
			throw new Error('already finalized');
		}
		assert(name, 'name');
		assert(operation, 'operation');
		const _type = ops[name];
		assert(_type, `Unknown operation ${name}`);
		const operation_id = ChainTypes.operations[_type.operation_name];
		if (operation_id === undefined) {
			throw new Error(`unknown operation: ${_type.operation_name}`);
		}
		if (!operation.fee) {
			operation.fee = { amount: 0, asset_id: 0 };
		}
		if (name === 'proposal_create') {
			/*
            * Proposals involving the committee account require a review
            * period to be set, look for them here
            */
			let requiresReview = false;
			let	extraReview = 0;
			operation.proposed_ops.forEach((op) => {
				const COMMITTE_ACCOUNT = 0;
				let key;

				switch (op.op[0]) {
					case 0: // transfer
						key = 'from';
						break;

					case 6: // account_update
					case 17: // asset_settle
						key = 'account';
						break;

					case 10: // asset_create
					case 11: // asset_update
					case 12: // asset_update_bitasset
					case 13: // asset_update_feed_producers
					case 14: // asset_issue
					case 18: // asset_global_settle
					case 43: // asset_claim_fees
						key = 'issuer';
						break;

					case 15: // asset_reserve
						key = 'payer';
						break;

					case 16: // asset_fund_fee_pool
						key = 'from_account';
						break;

					case 22: // proposal_create
					case 23: // proposal_update
					case 24: // proposal_delete
						key = 'fee_paying_account';
						break;

					case 31: // committee_member_update_global_parameters
						requiresReview = true;
						extraReview = 60 * 60 * 24 * 13; // Make the review period 2 weeks total
						break;
					default: break;
				}

				if (key in op.op[1] && op.op[1][key] === COMMITTE_ACCOUNT) {
					requiresReview = true;
				}
			});

			// operation.expiration_time ||
			// (operation.expiration_time = (base_expiration_sec() +
			// ChainConfig.expire_in_secs_proposal));
			if (requiresReview) {
				operation.review_period_seconds = extraReview + Math.max(
					committeeMinReview,
					24 * 60 * 60 || ChainConfig.review_in_secs_committee,
				);
				/*
                * Expiration time must be at least equal to
                * now + review_period_seconds, so we add one hour to make sure
                */
				operation.expiration_time += ((60 * 60) + extraReview);
			}
		}
		const operation_instance = _type.fromObject(operation);
		return [operation_id, operation_instance];
	}

	/* optional: fetch the current head block */

	update_head_block() {
		return Promise.all([
			Apis.instance().dbApi().exec('get_objects', [['2.0.0']]),
			Apis.instance().dbApi().exec('get_objects', [['2.1.0']]),
		]).then((res) => {
			const [g, r] = res;
			headBlockTimeString = r[0].time;
			committeeMinReview = g[0].parameters.committee_proposal_review_period;
		});
	}

	/** optional: there is a deafult expiration */
	set_expire_seconds(sec) {
		if (this.tr_buffer) {
			throw new Error('already finalized');
		}

		this.expiration = base_expiration_sec() + sec;

		return this.expiration;
	}

	/* Wraps this transaction in a proposal_create transaction */
	propose(proposal_create_options) {
		if (this.tr_buffer) {
			throw new Error('already finalized');
		}
		if (!this.operations.length) {
			throw new Error('add operation first');
		}

		assert(proposal_create_options, 'proposal_create_options');
		assert(proposal_create_options.fee_paying_account, 'proposal_create_options.fee_paying_account');

		const proposed_ops = this.operations.map((op) => ({ op }));

		this.operations = [];
		this.signatures = [];
		this.signer_private_keys = [];
		proposal_create_options.proposed_ops = proposed_ops;
		this.add_type_operation('proposal_create', proposal_create_options);
		return this;
	}

	has_proposed_operation() {
		let hasProposed = false;
		for (let i = 0; i < this.operations.length; i += 1) {
			if ('proposed_ops' in this.operations[i][1]) {
				hasProposed = true;
				break;
			}
		}

		return hasProposed;
	}

	/** optional: the fees can be obtained from the witness node */
	set_required_fees(asset_id) {
		let fee_pool;
		if (this.tr_buffer) {
			throw new Error('already finalized');
		}
		if (!this.operations.length) {
			throw new Error('add operations first');
		}
		const operations = [];
		for (let i = 0, op; i < this.operations.length; i += 1) {
			op = this.operations[i];
			operations.push(ops.operation.toObject(op));
		}

		if (!asset_id) {
			const op1_fee = operations[0][1].fee;
			if (op1_fee && op1_fee.asset_id !== null) {
				const id = op1_fee.asset_id;
				asset_id = id;
			} else {
				asset_id = '1.3.0';
			}
		}

		const promises = [
			Apis.instance().dbApi().exec('get_required_fees', [operations, asset_id]),
		];


		if (asset_id !== '1.3.0') {
			// This handles the fallback to paying fees in GPH if the fee pool is empty.
			promises.push(Apis.instance().dbApi().exec('get_required_fees', [operations, '1.3.0']));
			promises.push(Apis.instance().dbApi().exec('get_objects', [[asset_id]]));
		}

		let fees;
		let	coreFees;
		let	asset;
		return Promise.all(promises).then((results) => {
			[fees, coreFees, asset] = results;

			asset = asset ? asset[0] : null;

			const dynamicPromise = (asset_id !== '1.3.0' && asset) ?
				Apis.instance().dbApi().exec('get_objects', [[asset.dynamic_asset_data_id]]) :
				new Promise((resolve) => resolve());
			return dynamicPromise;
		})
			.then((dynamicObject) => {
				if (asset_id !== '1.3.0') {
					fee_pool = dynamicObject ? dynamicObject[0].fee_pool : 0;
					let totalFees = 0;
					for (let j = 0, fee; j < coreFees.length; j += 1) {
						fee = coreFees[j];
						totalFees += fee.amount;
					}

					if (totalFees > parseInt(fee_pool, 10)) {
						fees = coreFees;
						asset_id = '1.3.0';
					}
				}

				// Proposed transactions need to be flattened
				const flat_assets = [];
				const flatten = function (obj) {
					if (Array.isArray(obj)) {
						for (let k = 0, item; k < obj.length; k += 1) {
							item = obj[k];
							flatten(item);
						}
					} else {
						flat_assets.push(obj);
					}

				};
				flatten(fees);

				let asset_index = 0;

				const set_fee = (operation) => {
					if (!operation.fee || operation.fee.amount === 0
						|| (operation.fee.amount.toString && operation.fee.amount.toString() === '0')// Long
					) {
						operation.fee = flat_assets[asset_index];
						// console.log("new operation.fee", operation.fee)
					} else {
						// console.log("old operation.fee", operation.fee)
					}
					asset_index += 1;
					const result = [];
					if (operation.proposed_ops) {
						for (let y = 0; y < operation.proposed_ops.length; y += 1) {
							result.push(set_fee(operation.proposed_ops[y].op[1]));
						}
					}

					return result;
				};
				for (let i = 0; i < this.operations.length; i += 1) {
					set_fee(this.operations[i][1]);
				}
				if (DEBUG) {
					console.log('... get_required_fees', operations, asset_id, flat_assets);
				}
			});
	}

	get_potential_signatures() {
		const tr_object = ops.signed_transaction.toObject(this);
		return Promise.all([
			Apis.instance().dbApi().exec('get_potential_signatures', [tr_object]),
			Apis.instance().dbApi().exec('get_potential_address_signatures', [tr_object]),
		]).then((results) => ({ pubkeys: results[0], addys: results[1] }));
	}

	get_required_signatures(available_keys) {
		if (!available_keys.length) {
			return Promise.resolve([]);
		}
		const tr_object = ops.signed_transaction.toObject(this);
		if (DEBUG) {
			console.log('... tr_object', tr_object);
		}
		return Apis.instance().dbApi().exec('get_required_signatures', [tr_object, available_keys]).then((required_public_keys) => {
			if (DEBUG) {
				console.log('... get_required_signatures', required_public_keys);
			}
			return required_public_keys;
		});
	}

	add_signer(private_key, public_key = private_key.toPublicKey()) {

		assert(private_key.d, 'required PrivateKey object');

		if (this.signed) {
			throw new Error('already signed');
		}
		if (!public_key.Q) {
			public_key = PublicKey.fromPublicKeyString(public_key);
		}
		// prevent duplicates
		const spHex = private_key.toHex();
		for (const sp of this.signer_private_keys) {
			if (sp[0].toHex() === spHex) {
				return;
			}
		}
		this.signer_private_keys.push([private_key, public_key]);
	}

	sign(chain_id = Apis.instance().chain_id) {
		if (!this.tr_buffer) {
			throw new Error('not finalized');
		}
		if (this.signed) {
			throw new Error('already signed');
		}
		if (!this.signer_private_keys.length) {
			throw new Error('Transaction was not signed. Do you have a private key? [no_signers]');
		}
		const end = this.signer_private_keys.length;
		for (let i = 0; end > 0 ? i < end : i > end; end > 0 ? i += 1 : i += 1) {
			const [private_key, public_key] = this.signer_private_keys[i];
			const sig = Signature.signBuffer(
				Buffer.concat([Buffer.from(chain_id, 'hex'), this.tr_buffer]),
				private_key,
				public_key,
			);
			this.signatures.push(sig.toBuffer());
		}
		this.signer_private_keys = [];
		this.signed = true;

	}

	serialize() {
		return ops.signed_transaction.toObject(this);
	}

	toObject() {
		return ops.signed_transaction.toObject(this);
	}

	broadcast(was_broadcast_callback) {
		if (this.tr_buffer) {
			return this._broadcast(was_broadcast_callback);
		}
		return this.finalize().then(() => this._broadcast(was_broadcast_callback));

	}

}


export default TransactionBuilder;
