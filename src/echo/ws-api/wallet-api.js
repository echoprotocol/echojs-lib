import * as serializers from '../../serializers';
import { API_CONFIG } from '../../constants';
import ReconnectionWebSocket from '../ws/reconnection-websocket';
import {
	isAccountIdOrName,
	isAssetIdOrName,
	isMethodExists,
	isAccountName,
	isBytecode,
	isContractResultId,
	validateUrl,
} from '../../utils/validators';

const { ethAddress } = serializers.protocol;
const { vector, optional } = serializers.collections;
const { privateKey, publicKey, ripemd160 } = serializers.chain;
const { options, bitassetOptions } = serializers.protocol.asset;
const { priceFeed } = serializers.protocol;
const { config } = serializers.plugins.echorand;
const { anyObjectId } = serializers.chain.ids;

const {
	uint64,
	uint32,
	int64,
	uint16,
	uint8,
} = serializers.basic.integers;

const {
	timePointSec,
	variantObject,
	string,
	bool,
} = serializers.basic;

const {
	operation,
	approvalDelta,
	accountListing,
	signedTransaction,
	transaction,
} = serializers;

const {
	accountId,
	contractId,
	erc20TokenId,
	proposalId,
	assetId,
} = serializers.chain.ids.protocol;

/**
 * @typedef {typeof import("../../serializers/transaction")['signedTransactionSerializer']} SignedTransactionSerializer
 */
/** @typedef {SignedTransactionSerializer['__TOutput__']} SignedTransaction */
/** @typedef {typeof import("../../serializers/chain")['ripemd160']['__TOutput__']} TransactionIdType */
/** @typedef {typeof import("../../serializers/chain")['asset']['__TOutput__']} Asset */
/** @typedef {typeof import("../../serializers/transaction")['default']} TransactionSerializer */
/** @typedef {TransactionSerializer['__TOutput__']} Transaction */
/** @typedef {typeof import("../../serializers")['operation']['__TOutput__']} Operation */


class WalletAPI {

	/**
	 * @constructor
	 */
	constructor() {
		this.wsRpc = new ReconnectionWebSocket();
	}

	/**
	 * Init params and connect to chain.
	 * @method connect
	 * @param {String} url - remote node address
	 * @param {Parameters<ReconnectionWebSocket['connect']>[1]} connectionOptions - connection params.
	 *
	 * @returns {Promise<void>}
	 */
	async connect(url, connectionOptions) {
		await this.wsRpc.connect(url, connectionOptions);
	}

	/**
	 * Exit from current wallet.
	 * @method exit
	 *
	 * @returns {Promise<never>}
	 */
	exit() {
		return this.wsRpc.call([0, 'exit', []]);
	}

	/**
	 * Returns a list of all commands supported by the wallet API.
	 * This lists each command, along with its arguments and return types.
	 * For more detailed help on a single command, use `get_help()`
	 * @method help
	 *
	 * @returns {Promise<String>} a multi-line string suitable for displaying on a terminal
	 */
	help() {
		return this.wsRpc.call([0, 'help', []]);
	}

	/**
	 * Returns detailed help on a single API command.
	 * @method helpMethod
	 * @param {String} method [the name of the API command you want help with]
	 *
	 * @returns {Promise<String>} a multi-line string suitable for displaying on a terminal
	 */
	helpMethod(method) {
		isMethodExists(method);
		return this.wsRpc.call([0, 'help_method', [string.toRaw(method)]]);
	}

	/**
	 * Returns info about head block, chain_id, maintenance, participation,
	 * current active witnesses and committee members.
	 * @method info
	 *
	 * @returns {Promise<Object>} runtime info about the blockchain
	 */
	info() {
		return this.wsRpc.call([0, 'info', []]);
	}

	/**
	 * Returns info such as client version, git version of graphene/fc, version of boost, openssl.
	 * @method about
	 *
	 * @returns {Promise<Object>} compile time info and client and dependencies versions
	 */
	about() {
		return this.wsRpc.call([0, 'about', []]);
	}

	/**
	 * Add nodes to the network
	 * @method networkAddNodes
	 * @param {Array<String>} nodes [nodes for adding]
	 *
	 * @returns {Promise<void>}
	 */
	networkAddNodes(nodes) {
		return this.wsRpc.call([0, 'network_add_nodes', [vector(string).toRaw(nodes)]]);
	}

	/**
	 * Get peers connected to network.
	 * @method networkGetConnectedPeers
	 *
	 * @returns {Promise<any[]>} peers connected to network
	 */
	networkGetConnectedPeers() {
		return this.wsRpc.call([0, 'network_get_connected_peers', []]);
	}

	/**
	 * @ingroup Wallet Management
	 *
	 * Checks whether the wallet has just been created and has not yet had a password set.
	 * Calling `set_password` will transition the wallet to the locked state.
	 * @method isNew
	 *
	 * @returns {Promise<Boolean>} true if the wallet is new
	 */
	isNew() {
		return this.wsRpc.call([0, 'is_new', []]);
	}

	/**
	 * @ingroup Wallet Management
	 *
	 * Checks whether the wallet is locked (is unable to use its private keys).
	 * This state can be changed by calling `lock()` or `unlock()`.
	 * @method isLocked
	 *
	 * @returns {Promise<Boolean>} true if the wallet is locked
	 */
	isLocked() {
		return this.wsRpc.call([0, 'is_locked', []]);
	}

	/**
	 * @ingroup Wallet Management
	 *
	 * Locks the wallet immediately.
	 * @method lock
	 *
	 * @returns {Promise<void>}
	 */
	lock() {
		return this.wsRpc.call([0, 'lock', []]);
	}

	/**
	 * @ingroup Wallet Management
	 *
	 * Unlocks the wallet.
	 * The wallet remain unlocked until the `lock` is called or the program exits.
	 * @method unlock
	 * @param {String} password [the password previously set with `set_password()`,
	 * in the wallet it should be input interactively]
	 *
	 * @returns {Promise<void>}
	 */
	unlock(password) {
		return this.wsRpc.call([0, 'unlock', [string.toRaw(password)]]);
	}

	/**
	 * @ingroup Wallet Management
	 *
	 * Sets a new password on the wallet.
	 * The wallet must be either 'new' or 'unlocked' to execute this command.
	 * @method setPassword
	 * @param {String} password [the password, should be input automatically in the wallet]
	 *
	 * @returns {Promise<void>}
	 */
	setPassword(password) {
		return this.wsRpc.call([0, 'set_password', [string.toRaw(password)]]);
	}

	/**
	 * Create new EdDSA keypair encoded in base58.
	 * @method createEddsaKeypair
	 *
	 * @returns {Promise<[string, string]>} new private and public key
	 */
	createEddsaKeypair() {
		return this.wsRpc.call([0, 'create_eddsa_keypair', []]);
	}

	/**
	 * Dumps all private keys owned by the wallet.
	 * The keys are printed in WIF format. You can import these keys into another wallet using `import_key()`
	 * @method dumpPrivateKeys
	 *
	 * @returns {Promise<[string, string][]>} a map containing the private keys, indexed by their public key
	 */
	dumpPrivateKeys() {
		return this.wsRpc.call([0, 'dump_private_keys', []]);
	}

	/**
	 * Dumps private key from old b58 format to new WIF.
	 * The keys are printed in WIF format. You can import these key into another wallet using `import_key()`.
	 * @method oldKeyToWif
	 * @param {String} accountPrivateKey [old b58 format eddsa private_key]
	 *
	 * @returns {Promise<String>} string new in WIF eddsa private key
	 */
	oldKeyToWif(accountPrivateKey) {
		return this.wsRpc.call([0, 'old_key_to_wif', [string.toRaw(accountPrivateKey)]]);
	}

	/**
	 * Imports the private key for an existing account.
	 * The private key must match either an owner key or an active key for the named account.
	 *
	 * @see `dump_private_keys()`
	 *
	 * @method importKey
	 * @param {String} accountNameOrId [the account owning the key]
	 * @param {String} privateKeyWif [the private key, should be input interactively]
	 *
	 * @returns {Promise<Boolean>} true if the key was imported
	 */
	importKey(accountNameOrId, privateKeyWif) {
		isAccountIdOrName(accountNameOrId);
		return this.wsRpc.call([0, 'import_key', [string.toRaw(accountNameOrId), privateKey.toRaw(privateKeyWif)]]);
	}

	/**
	 * Imports accounts from a blockchain wallet file. Current wallet file must be unlocked to perform the import.
	 * @method importAccounts
	 * @param {String} filename [the blockchain wallet file to import]
	 * @param {String} password [the password to encrypt the blockchain wallet file]
	 *
	 * @returns {<[string, boolean][]>} a map containing the accounts found and whether imported
	 */
	importAccounts(filename, password) {
		return this.wsRpc.call([0, 'import_accounts', [string.toRaw(filename), string.toRaw(password)]]);
	}

	/**
	 * Imports from a blockchain wallet file, find keys that were bound to a given account name on
	 * the blockchain, rebind them to an account name on the chain.
	 * Current wallet file must be unlocked to perform the import.
	 * @method importAccountKeys
	 * @param {String} filename [the blockchain wallet file to import]
	 * @param {String} password [the password to encrypt the blockchain wallet file]
	 * @param {String} srcAccountName [name of the account on blockchain]
	 * @param {String} destAccountName [name of the account on blockchain, can be same or different
	 * to `src_account_name`]
	 *
	 * @returns {Promise<Boolean>} whether the import has succeeded
	 */
	importAccountKeys(filename, password, srcAccountName, destAccountName) {
		if (!isAccountName(srcAccountName)) throw new Error('srcAccount name should be string and valid');
		if (!isAccountName(destAccountName)) throw new Error('destAccount name should be string and valid');

		return this.wsRpc.call([0, 'import_account_keys',
			[
				string.toRaw(filename),
				string.toRaw(password),
				string.toRaw(srcAccountName),
				string.toRaw(destAccountName),
			],
		]);
	}

	/**
	 * This call will construct transaction(s) that will claim all balances controlled
	 * by 'wif_keys' and deposit them into the given account. 'wif_key' should be input interactively
	 * @method importBalance
	 * @param {String} accountNameOrId [name or ID of an account that to claim balances to]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 * @param {Array<String>} wifKeys [private WIF keys of balance objects to claim balances from]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	importBalance(accountNameOrId, shouldDoBroadcastToNetwork, wifKeys) {
		isAccountIdOrName(accountNameOrId);
		return this.wsRpc.call([0, 'import_balance',
			[
				string.toRaw(accountNameOrId),
				bool.toRaw(shouldDoBroadcastToNetwork),
				vector(privateKey).toRaw(wifKeys),
			],
		]);
	}

	/**
	 * Suggests a safe brain key to use for creating your account. `create_account_with_brain_key()` requires you
	 * to specify a 'brain key', a long passphrase that provides enough entropy to generate cyrptographic keys.
	 * This function will suggest a suitably random string that should be easy to write down
	 * (and, with effort, memorize).
	 * @method suggestBrainKey
	 *
	 * @returns {Promise<Object>} a suggested brain_key
	 */
	suggestBrainKey() {
		return this.wsRpc.call([0, 'suggest_brain_key', []]);
	}

	/**
	 * Derive any number of *possible* owner keys from a given brain key.
	 * NOTE: These keys may or may not match with the owner keys of any account.
	 * This function is merely intended to assist with account or key recovery.
	 *
	 * @see suggest_brain_key()
	 *
	 * @method deriveKeysFromBrainKey
	 * @param {String} brainKey [brain key]
	 * @param {Number} numberOfDesiredKeys [number of desired keys]
	 *
	 * @returns {Promise<Object[]>} A list of keys that are deterministically derived from the brainkey
	 */
	deriveKeysFromBrainKey(brainKey, numberOfDesiredKeys) {
		return this.wsRpc.call([0, 'derive_keys_from_brain_key',
			[string.toRaw(brainKey), int64.toRaw(numberOfDesiredKeys)],
		]);
	}

	/**
	 * Determine whether a textual representation of a public key (in Base-58 format) is *currently* linked
	 * to any *registered* (i.e. non-stealth) account on the blockchain.
	 * @method isPublicKeyRegistered
	 * @param {String} accountPublicKey [public key]
	 *
	 * @returns {Promise<Boolean>} Whether a public key is known
	 */
	isPublicKeyRegistered(accountPublicKey) {
		return this.wsRpc.call([0, 'is_public_key_registered', [publicKey.toRaw(accountPublicKey)]]);
	}

	/**
	 * This method is used to convert a JSON transaction to it's transaction ID.
	 * @method getTransactionId
	 * @param {Object} tr [the singed transaction]
	 *
	 * @returns {Promise<TransactionIdType>} transaction id string
	 */
	getTransactionId(tr) {
		return this.wsRpc.call([0, 'get_transaction_id', [signedTransaction.toRaw(tr)]]);
	}

	/**
	 * Get the WIF private key corresponding to a public key. The private key must already be in the wallet.
	 * @method getPrivateKey
	 * @param {String} accountPublicKey [public key of an account]
	 *
	 * @returns {Promise<String>} private key of this account
	 */
	getPrivateKey(accountPublicKey) {
		return this.wsRpc.call([0, 'get_private_key', [publicKey.toRaw(accountPublicKey)]]);
	}

	/**
	 * Loads a specified Graphene wallet. The current wallet is closed before the new wallet is loaded.
	 *
	 * @warning This does not change the filename that will be used for future wallet writes,
	 * so this may cause you to overwrite your original wallet unless you also call `set_wallet_filename()`
	 *
	 * @method loadWalletFile
	 * @param {String} walletFilename [the filename of the wallet JSON file to load.
	 * If `wallet_filename` is empty, it reloads the existing wallet file]
	 *
	 * @returns {Promise<Boolean>} true if the specified wallet is loaded
	 */
	loadWalletFile(walletFilename) {
		return this.wsRpc.call([0, 'load_wallet_file', [string.toRaw(walletFilename)]]);
	}

	/**
	 * Transforms a brain key to reduce the chance of errors when re-entering the key from memory.
	 * This takes a user-supplied brain key and normalizes it into the form used for generating private keys.
	 * In particular, this upper-cases all ASCII characters and collapses multiple spaces into one.
	 * @method normalizeBrainKey
	 * @param {String} brainKey [the brain key as supplied by the user]
	 *
	 * @returns {Promise<String>} the brain key in its normalized form
	 */
	normalizeBrainKey(brainKey) {
		return this.wsRpc.call([0, 'normalize_brain_key', [string.toRaw(brainKey)]]);
	}

	/**
	 * Saves the current wallet to the given filename.
	 * @warning This does not change the wallet filename that will be used for future writes, so think of this function
	 * as 'Save a Copy As...' instead of 'Save As...'. Use `set_wallet_filename()` to make the filename persist.
	 * @method saveWalletFile
	 * @param {String} walletFilename [the filename of the new wallet JSON file to create or overwrite.
	 * If `wallet_filename` is empty, save to the current filename]
	 *
	 * @returns {Promise<void>}
	 */
	saveWalletFile(walletFilename) {
		return this.wsRpc.call([0, 'save_wallet_file', [string.toRaw(walletFilename)]]);
	}

	/**
	 * Lists all accounts controlled by this wallet.
	 * This returns a list of the full account objects for all accounts whose private keys we possess.
	 * @method listMyAccounts
	 *
	 * @returns {Promise<Object[]>} a list of account objects
	 */
	listMyAccounts() {
		return this.wsRpc.call([0, 'list_my_accounts', []]);
	}

	/**
	 * Lists all accounts registered in the blockchain.
	 * This returns a list of all account names and their account ids, sorted by account name.
	 * Use the `lowerbound` and limit parameters to page through the list. To retrieve all accounts,
	 * start by setting `lowerbound` to the empty string ``, and then each iteration, pass
	 * the last account name returned as the `lowerbound` for the next `list_accounts()` call.
	 * @method listAccounts
	 * @param {String} lowerbound [the name of the first account to return. If the named account does not exist,
	 * the list will start at the account that comes after `lowerbound`]
	 * @param {Number} limit [limit the maximum number of accounts to return (max: 1000)]
	 *
	 * @returns {Promise<[string, string][]>} a list of accounts mapping account names to account ids
	 */
	listAccounts(lowerbound, limit = API_CONFIG.LIST_ACCOUNTS_DEFAULT_LIMIT) {
		if (!isAccountName(lowerbound)) throw new Error('Account name should be string and valid');
		if (!limit > API_CONFIG.LIST_ACCOUNTS_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.LIST_ACCOUNTS_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'list_accounts', [string.toRaw(lowerbound), uint32.toRaw(limit)]]);
	}

	/**
	 * List the balances of an account or a contract.
	 * @method listAccountBalances
	 * @param {String} accountNameOrId [id the id of either an account or a contract]
	 *
	 * @returns {Promise<Asset[]>} a list of the given account/contract balances
	 */
	listAccountBalances(accountNameOrId) {
		isAccountIdOrName(accountNameOrId);
		return this.wsRpc.call([0, 'list_account_balances', [string.toRaw(accountNameOrId)]]);
	}

	/**
	 * List the balances of an account or a contract.
	 * @method listIdBalances
	 * @param {String} idOfAccount [id the id of either an account or a contract]
	 *
	 * @returns {Promise<Asset[]>} a list of the given account/contract balances
	 */
	listIdBalances(idOfAccount) {
		return this.wsRpc.call([0, 'list_id_balances', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * Registers a third party's account on the blockckain.
	 * This function is used to register an account for which you do not own the private keys.
	 * When acting as a registrar, an end user will generate their own private keys and send you the public keys.
	 * The registrar will use this function to register the account on behalf of the end user.
	 *
	 * @see `create_account_with_brain_key()`
	 *
	 * @method registerAccount
	 * @param  {String} name [the name of the account, must be unique on the blockchain.
	 * Shorter names are more expensive to register; the rules are still in flux,
	 * but in general names of more than 8 characters with at least one digit will be cheap]
	 * @param  {String} activeKey [the active key for the new account]
	 * @param  {String} accountNameOrId [the account which will pay the fee to register the user]
	 * @param  {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction registering the account
	 */
	registerAccount(name, activeKey, accountNameOrId, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountNameOrId);
		return this.wsRpc.call([0, 'register_account',
			[
				string.toRaw(name),
				publicKey.toRaw(activeKey),
				string.toRaw(accountNameOrId),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Creates a new account and registers it on the blockchain.
	 *
	 * @see `suggest_brain_key()`
	 * @see `register_account()`
	 *
	 * @method createAccountWithBrainKey
	 * @param {String} brainKey [the brain key used for generating the account's private keys]
	 * @param {String} accountName [the name of the account, must be unique on the blockchain.
	 * Shorter names are more expensive to register; the rules are still in flux,
	 * but in general names of more than 8 characters with at least one digit will be cheap]
	 * @param {String} accountNameOrId [the account which will pay the fee to register the user]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction registering the account
	 */
	createAccountWithBrainKey(brainKey, accountName, accountNameOrId, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountNameOrId);
		return this.wsRpc.call([0, 'create_account_with_brain_key',
			[
				string.toRaw(brainKey),
				string.toRaw(accountName),
				string.toRaw(accountNameOrId),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Upload/Create a contract.
	 * @method createContract
	 * @param {String} accountNameOrId [name of the account creating the contract]
	 * @param {String} contractCode [code of the contract]
	 * @param {Number} amount [the amount of asset transferred to the contract]
	 * @param {String} assetType [the type of the asset transferred to the contract]
	 * @param {String} supportedAssetId [the asset that can be used to create/call the contract
	 * (see https://echo-dev.io/developers/smart-contracts/solidity/introduction/#flag-of-supported-asset)]
	 * @param {Boolean} useEthereumAssetAccuracy [whether to use the ethereum asset accuracy
	 * (see https://echo-dev.io/developers/smart-contracts/solidity/introduction/#flag-of-using-ethereum-accuracy)]
	 * @param {Boolean} shouldSaveToWallet [whether to save the contract to the wallet]
	 *
	 * @returns {Promise<Object>} the signed transaction creating the contract
	 */
	createContract(
		accountNameOrId,
		contractCode,
		amount,
		assetType,
		supportedAssetId,
		useEthereumAssetAccuracy,
		shouldSaveToWallet,
	) {
		isAccountIdOrName(accountNameOrId);
		// if (!isBytecode(contractCode)) throw new Error('Bytecode should be string and valid');
		return this.wsRpc.call([0, 'create_contract',
			[
				string.toRaw(accountNameOrId),
				string.toRaw(contractCode),
				uint64.toRaw(amount),
				assetId.toRaw(assetType),
				assetId.toRaw(supportedAssetId),
				bool.toRaw(useEthereumAssetAccuracy),
				bool.toRaw(shouldSaveToWallet),
			],
		]);
	}

	/**
	 * Call a contract.
	 * @method callContract
	 * @param {String} accountNameOrId [name of the account calling the contract]
	 * @param {String} idOfContract [the id of the contract to call]
	 * @param {String} contractCode [the hash of the method to call]
	 * @param {Number} amount [the amount of asset transferred to the contract]
	 * @param {String} assetType [the type of the asset transferred to the contract]
	 * @param {Boolean} shouldSaveToWallet [whether to save the contract call to the wallet]
	 *
	 * @returns {Promise<Object>} the signed transaction calling the contract
	 */
	callContract(
		accountNameOrId,
		idOfContract,
		contractCode,
		amount,
		assetType,
		shouldSaveToWallet,
	) {
		isAccountIdOrName(accountNameOrId);
		return this.wsRpc.call([0, 'call_contract',
			[
				string.toRaw(accountNameOrId),
				contractId.toRaw(idOfContract),
				string.toRaw(contractCode),
				uint64.toRaw(amount),
				assetId.toRaw(assetType),
				bool.toRaw(shouldSaveToWallet),
			],
		]);
	}

	/**
	 * Fund feepool of contract.
	 * @method contractFundFeePool
	 * @param {String} accountNameOrId [name of the account which fund contract's feepool]
	 * @param {String} idOfContract [the id of the contract's feepool]
	 * @param {Number} amount [the amount of asset transferred to the contract in default asset_id_type()]
	 * @param {Boolean} shouldDoBroadcastToNetwork [whether to broadcast the fund contract operation to the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	contractFundFeePool(accountNameOrId, idOfContract, amount, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountNameOrId);
		return this.wsRpc.call([0, 'contract_fund_fee_pool',
			[
				string.toRaw(accountNameOrId),
				contractId.toRaw(idOfContract),
				uint64.toRaw(amount),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Get the result of contract execution.
	 * @method getContractResult
	 * @param {String} contractResultId [the id of the contract result]
	 *
	 * @returns {Promise<Object>} the result of the contract
	 */
	getContractResult(contractResultId) {
		if (!isContractResultId(contractResultId)) throw new Error('Contract resultId should be string and valid');
		return this.wsRpc.call([0, 'get_contract_result', [string.toRaw(contractResultId)]]);
	}

	/**
	 * Transfer an amount from one account to another.
	 * @method transfer
	 * @param {String} fromAccountNameOrId [the name or id of the account sending the funds]
	 * @param {String} toAccountNameOrId [the name or id of the account receiving the funds]
	 * @param {String} amount [the amount to send (in nominal units -- to send half of a BTS, specify 0.5)]
	 * @param {String} assetIdOrName [the symbol or id of the asset to send]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction transferring funds
	 */
	transfer(fromAccountNameOrId, toAccountNameOrId, amount, assetIdOrName, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(fromAccountNameOrId);
		isAccountIdOrName(toAccountNameOrId);
		isAssetIdOrName(assetIdOrName);

		return this.wsRpc.call([0, 'transfer',
			[
				string.toRaw(fromAccountNameOrId),
				string.toRaw(toAccountNameOrId),
				string.toRaw(amount),
				string.toRaw(assetIdOrName),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * his method works just like transfer, except it always broadcasts and
	 * returns the transaction ID along with the signed transaction.
	 * @method transfer2
	 * @param {String} fromAccountNameOrId [the name or id of the account sending the funds]
	 * @param {String} toAccountNameOrId [the name or id of the account receiving the funds]
	 * @param {String} amount [the amount to send (in nominal units -- to send half of a BTS, specify 0.5)]
	 * @param {String} assetIdOrName [the symbol or id of the asset to send]
	 *
	 * @returns {Promise<Array>} the transaction ID along with the signed transaction
	 */
	transfer2(fromAccountNameOrId, toAccountNameOrId, amount, assetIdOrName) {
		isAccountIdOrName(fromAccountNameOrId);
		isAccountIdOrName(toAccountNameOrId);
		isAssetIdOrName(assetIdOrName);

		return this.wsRpc.call([0, 'transfer2',
			[
				string.toRaw(fromAccountNameOrId),
				string.toRaw(toAccountNameOrId),
				string.toRaw(amount),
				string.toRaw(assetIdOrName),
			],
		]);
	}

	/**
	 * Whitelist and blacklist accounts, primarily for transacting in whitelisted assets.
	 * Accounts can freely specify opinions about other accounts, in the form of either whitelisting or blacklisting
	 * them. This information is used in chain validation only to determine whether an account is authorized to transact
	 * in an asset type which enforces a whitelist, but third parties can use this information for other uses as well,
	 * as long as it does not conflict with the use of whitelisted assets.
	 * An asset which enforces a whitelist specifies a list of accounts to maintain its whitelist, and a list of
	 * accounts to maintain its blacklist. In order for a given account A to hold and transact in a whitelisted asset S,
	 * A must be whitelisted by at least one of S's whitelist_authorities and blacklisted by none of S's
	 * blacklist_authorities. If A receives a balance of S, and is later removed from the whitelist(s) which allowed it
	 * to hold S, or added to any blacklist S specifies as authoritative, A's balance of S will be frozen until A's
	 * authorization is reinstated.
	 * @method whitelistAccount
	 * @param {String} authorizingAccount [the account who is doing the whitelisting]
	 * @param {String} accountToList [the account being whitelisted]
	 * @param {Number} newListingStatus [the new whitelisting status]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction changing the whitelisting status
	 */
	whitelistAccount(authorizingAccount, accountToList, newListingStatus, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(authorizingAccount);
		isAccountIdOrName(accountToList);
		return this.wsRpc.call([0, 'whitelist_account',
			[
				string.toRaw(authorizingAccount),
				string.toRaw(accountToList),
				accountListing.toRaw(newListingStatus),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Get information about a vesting balance object.
	 * @method getVestingBalances
	 * @param {String} accountNameOrId [an account name, account ID, or vesting balance object ID]
	 *
	 * @returns {Promise<Object[]>} vesting balance object with info
	 */
	getVestingBalances(accountNameOrId) {
		isAccountIdOrName(accountNameOrId);
		return this.wsRpc.call([0, 'get_vesting_balances', [string.toRaw(accountNameOrId)]]);
	}

	/**
	 * Withdraw a vesting balance.
	 * @method withdrawVesting
	 * @param {String} witnessAccountNameOrId [the account name of the witness, also accepts account ID or
	 * vesting balance ID type]
	 * @param {String} amount [the amount to withdraw]
	 * @param {String} assetSymbol [the symbol of the asset to withdraw]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	withdrawVesting(witnessAccountNameOrId, amount, assetSymbol, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(witnessAccountNameOrId);
		return this.wsRpc.call([0, 'withdraw_vesting',
			[
				string.toRaw(witnessAccountNameOrId),
				string.toRaw(amount),
				assetId.toRaw(assetSymbol),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Returns information about the given account.
	 * @method getAccount
	 * @param {String} accountNameOrId [returns information about the given account]
	 *
	 * @returns {Promise<Object>} the public account data stored in the blockchain
	 */
	getAccount(accountNameOrId) {
		isAccountIdOrName(accountNameOrId);
		return this.wsRpc.call([0, 'get_account', [string.toRaw(accountNameOrId)]]);
	}

	/**
	 * Lookup the id of a named account.
	 * @method getAccountId
	 * @param {String} accountName [the name of the account to look up]
	 *
	 * @returns {Promise<String>} the id of the named account
	 */
	getAccountId(accountName) {
		if (!isAccountName(accountName)) throw new Error('Account name should be string and valid');
		return this.wsRpc.call([0, 'get_account_id', [string.toRaw(accountName)]]);
	}

	/**
	 * Returns the most recent operations on the named account.
	 * This returns a list of operation history objects, which describe activity on the account.
	 * @method getAccountHistory
	 * @param {String} accountIdOrName [the name or id of the account]
	 * @param {Number} limit [the number of entries to return (starting from the most recent)]
	 *
	 * @returns {Promise<Object[]>} a list of `operation_history_objects`
	 */
	getAccountHistory(accountIdOrName, limit = API_CONFIG.ACCOUNT_HISTORY_DEFAULT_LIMIT) {
		isAccountIdOrName(accountIdOrName);
		if (!limit > API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'get_account_history',
			[string.toRaw(accountIdOrName),	int64.toRaw(limit)],
		]);
	}

	/**
	 * Returns the relative operations on the named account from start number.
	 * @method getRelativeAccountHistory
	 * @param {String} accountIdOrName [the name or id of the account]
	 * @param {Number} stop [sequence number of earliest operation]
	 * @param {Number} limit [the number of entries to return (max 100)]
	 * @param {Number} start [the sequence number where to start looping back throw the history]
	 *
	 * @returns {Promise<Object[]>} a list of `operation_history_objects`
	 */
	async getRelativeAccountHistory(
		accountIdOrName,
		stop = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_STOP,
		limit = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_DEFAULT_LIMIT,
		start = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_START,
	) {
		isAccountIdOrName(accountIdOrName);
		if (!limit > API_CONFIG.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'get_relative_account_history',
			[string.toRaw(accountIdOrName),	uint64.toRaw(stop),	int64.toRaw(limit),	uint64.toRaw(start)],
		]);
	}

	/**
	 * Get the contract object from the database by it's id.
	 * @method getContractObject
	 * @param {String} idOfContract [the id of the contract]
	 *
	 * @returns {Promise<Object>} the contract object
	 */
	getContractObject(idOfContract) {
		return this.wsRpc.call([0, 'get_contract_object', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * Get the contract information by the contract's id.
	 * @method getContract
	 * @param {String} idOfContract [id of the contract]
	 *
	 * @returns {Promise<Object>} the contract information
	 */
	getContract(idOfContract) {
		return this.wsRpc.call([0, 'get_contract', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * Whitelist or blacklist contract pool.
	 * @method whitelistContractPool
	 * @param {String} accountIdOrName [is an owner of contract which perform whitelisting or blacklisting]
	 * @param {String} idOfContract [whitelisting or blacklisting applying for this contract]
	 * @param {Array<String>} addToWhitelist [leave it empty if you don't want to add some account to whitelist]
	 * @param {Array<String>} addToBlacklist [leave it empty if you don't want to add some account to blacklist]
	 * @param {Array<String>} removeFromWhitelist [leave it empty if you don't want to remove some account
	 * from whitelist]
	 * @param {Array<String>} removeFromBlacklist [leave it empty if you don't want to remove some account
	 * from blacklist]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the contract whitelist operation]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	whitelistContractPool(
		accountIdOrName,
		idOfContract,
		addToWhitelist,
		addToBlacklist,
		removeFromWhitelist,
		removeFromBlacklist,
		shouldDoBroadcastToNetwork,
	) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'whitelist_contract_pool',
			[
				string.toRaw(accountIdOrName),
				contractId.toRaw(idOfContract),
				vector(accountId).toRaw(addToWhitelist),
				vector(accountId).toRaw(addToBlacklist),
				vector(accountId).toRaw(removeFromWhitelist),
				vector(accountId).toRaw(removeFromBlacklist),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Call a contract. Same as `call_contract()` but doesn't change the state.
	 * @method callContractNoChangingState
	 * @param {String} idOfContract [the id of the contract to call]
	 * @param {String} accountIdOrName [name of the account calling the contract]
	 * @param {String} assetType [the type of the asset transferred to the contract]
	 * @param {String} codeOfTheContract [the hash of the method to call]
	 *
	 * @returns {Promise<String>}
	 */
	callContractNoChangingState(idOfContract, accountIdOrName, assetType, codeOfTheContract) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'call_contract_no_changing_state',
			[
				contractId.toRaw(idOfContract),
				string.toRaw(accountIdOrName),
				assetId.toRaw(assetType),
				string.toRaw(codeOfTheContract),
			],
		]);
	}

	/**
	 * Get contract's feepool balance.
	 * @method getContractPoolBalance
	 * @param {String} idOfContract [id for getting feepool balance]
	 *
	 * @returns {Promise<Asset>} contract's feepool balance
	 */
	getContractPoolBalance(idOfContract) {
		return this.wsRpc.call([0, 'get_contract_pool_balance', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * Get contract's whitelist and blacklist.
	 * @method getContractPoolWhitelist
	 * @param {String} idOfContract [id for getting whitelist and blacklist of feepool object]
	 *
	 * @returns {Promise<Object>} whitelist and blacklist of contract pool object
	 */
	getContractPoolWhitelist(idOfContract) {
		return this.wsRpc.call([0, 'get_contract_pool_whitelist', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * Returns information about generated eth address, if then exist and approved, for the given account id.
	 * @method getEthAddress
	 * @param {String} idOfAccount [the id of the account to provide information about]
	 *
	 * @returns {Promise<string | undefined>} the public eth address data stored in the blockchain
	 */
	getEthAddress(idOfAccount) {
		return this.wsRpc.call([0, 'get_eth_address', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * Returns all approved deposits, for the given account id.
	 * @method getAccountDeposits
	 * @param {String} idOfAccount [the id of the account to provide information about]
	 *
	 * @returns {Promise<Object[]>} the all public deposits data stored in the blockchain
	 */
	getAccountDeposits(idOfAccount) {
		return this.wsRpc.call([0, 'get_account_deposits', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * Creates a transaction to register erc20_token for sidechain.
	 * @method registerErc20Token
	 * @param {String} accountIdOrName [the account who create erc20 token and become his owner]
	 * @param {String} ethereumTokenAddress [the address of token erc20 token in ethereum network]
	 * @param {String} tokenName [name of the token in echo network]
	 * @param {String} tokenSymbol [symbol of the token in echo network]
	 * @param {Number} decimals [number of the digits after the comma of the token in echo network]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	registerErc20Token(
		accountIdOrName,
		ethereumTokenAddress,
		tokenName,
		tokenSymbol,
		decimals,
		shouldDoBroadcastToNetwork,
	) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'register_erc20_token',
			[
				string.toRaw(accountIdOrName),
				ethAddress.toRaw(ethereumTokenAddress),
				string.toRaw(tokenName),
				string.toRaw(tokenSymbol),
				uint8.toRaw(decimals),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Returns information about erc20 token, if then exist.
	 * @method getErc20Token
	 * @param {String} ethereumTokenAddress [the ethereum address of token in Ethereum network]
	 *
	 * @returns {Promise<Object | undefined>} the public erc20 token data stored in the blockchain
	 */
	getErc20Token(ethereumTokenAddress) {
		return this.wsRpc.call([0, 'get_erc20_token', [ethAddress.toRaw(ethereumTokenAddress)]]);
	}

	/**
	 * Check on exist erc20 token.
	 * @method getErc20Token
	 * @param {String} idOfContract [ID of the contract to get erc20 token]
	 *
	 * @returns {Promise<Boolean>} true if erc20 token data stored in the blockchain, else false
	 */
	checkErc20Token(idOfContract) {
		return this.wsRpc.call([0, 'check_erc20_token', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * Returns all approved deposits, for the given account id.
	 * @method getErc20AccountDeposits
	 * @param {String} idOfAccount [the id of the account to provide information about]
	 *
	 * @returns {Promise<Object[]>} the all public erc20 deposits data stored in the blockchain
	 */
	getErc20AccountDeposits(idOfAccount) {
		return this.wsRpc.call([0, 'get_erc20_account_deposits', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * Returns all approved withdrawals, for the given account id.
	 * @method getErc20AccountWithdrawals
	 * @param {String} idOfAccount [the id of the account to provide information about]
	 *
	 * @returns {Promise<Object[]>} the all public erc20 withdrawals data stored in the blockchain
	 */
	getErc20AccountWithdrawals(idOfAccount) {
		return this.wsRpc.call([0, 'get_erc20_account_withdrawals', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * Creates a transaction to withdraw erc20_token.
	 * @method withdrawErc20Token
	 * @param {String} accountIdOrName [the account who withdraw erc20 token]
	 * @param {String} toEthereumAddress [the Ethereum address where withdraw erc20 token]
	 * @param {String} idOferc20Token [the erc20 token id in ECHO]
	 * @param {String} withdrawAmount [the amount withdraw]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	withdrawErc20Token(accountIdOrName, toEthereumAddress, idOferc20Token, withdrawAmount, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'withdraw_erc20_token',
			[
				string.toRaw(accountIdOrName),
				ethAddress.toRaw(toEthereumAddress),
				erc20TokenId.toRaw(idOferc20Token),
				string.toRaw(withdrawAmount),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Generate address of specified account
	 * @method generateAccountAddress
	 * @param {String} accountIdOrName [ID or name of the account]
	 * @param {String} label [label for new account address]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	generateAccountAddress(accountIdOrName, label, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'generate_account_address',
			[string.toRaw(accountIdOrName), string.toRaw(label),	bool.toRaw(shouldDoBroadcastToNetwork)]]);
	}

	/**
	 * Get addresses of specified account
	 * @method getAccountAddresses
	 * @param {String} idOfAccount [ID of the account]
	 * @param {Number} startFrom [number of block to start retrieve from]
	 * @param {Number} limit [maximum number of addresses to return]
	 *
	 * @returns {Promise<Object[]>} Addresses owned by account in specified ids interval
	 */
	getAccountAddresses(idOfAccount, startFrom, limit) {
		return this.wsRpc.call([0, 'get_account_addresses',
			[accountId.toRaw(idOfAccount), uint64.toRaw(startFrom), uint64.toRaw(limit)],
		]);
	}

	/**
	 * Get owner of specified address.
	 * @method getAccountByAddress
	 * @param {String} address [address in form of ripemd160 hash]
	 *
	 * @returns {Promise<string | undefined>} Account id of owner
	 */
	getAccountByAddress(address) {
		return this.wsRpc.call([0, 'get_account_by_address', [ripemd160.toRaw(address)]]);
	}

	/**
	 * Returns all approved withdrawals, for the given account id.
	 * @method getAccountWithdrawals
	 * @param {String} idOfAccount [the id of the account to provide information about]
	 *
	 * @returns {Promise<Object[]>} the all public withdrawals data stored in the blockchain
	 */
	getAccountWithdrawals(idOfAccount) {
		return this.wsRpc.call([0, 'get_account_withdrawals', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * Approve or disapprove a proposal.
	 * @method approveProposal
	 * @param {String} feePayingAccountId [the account paying the fee for the op]
	 * @param {String} idOfProposal [the proposal to modify]
	 * @param {Object} delta[members contain approvals to create or remove.
	 * In JSON you can leave empty members undefined]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	approveProposal(feePayingAccountId, idOfProposal, delta, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'approve_proposal',
			[
				accountId.toRaw(feePayingAccountId),
				proposalId.toRaw(idOfProposal),
				approvalDelta.toRaw(delta),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Generate ethereum address.
	 * @method generateEthAddress
	 * @param {String} accountIdOrName [the name or id of the account]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	generateEthAddress(accountIdOrName, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'generate_eth_address',
			[string.toRaw(accountIdOrName),	bool.toRaw(shouldDoBroadcastToNetwork)],
		]);
	}

	/**
	 * Withdraw ethereum.
	 * @method withdrawEth
	 * @param {String} accountIdOrName [the name or id of the account]
	 * @param {String} ethOfAddress [the address of token erc20 token in ethereum network]
	 * @param {Number} value [amount for withdraw]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	withdrawEth(accountIdOrName, ethOfAddress, value, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'withdraw_eth',
			[
				string.toRaw(accountIdOrName),
				ethAddress.toRaw(ethOfAddress),
				uint64.toRaw(value),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Flood the network.
	 * @method floodNetwork
	 * @param {String} prefix [prefix]
	 * @param {String} numberOfTransactions [number of transactions to flood]
	 *
	 * @returns {Promise<void>}
	 */
	floodNetwork(prefix, numberOfTransactions) {
		return this.wsRpc.call([0, 'flood_network',
			[string.toRaw(prefix), uint32.toRaw(numberOfTransactions)],
		]);
	}

	/**
	 * Lists all assets registered on the blockchain.
	 * To list all assets, pass the empty string `` for the lowerbound to start
	 * at the beginning of the list, and iterate as necessary.
	 * @method listAssets
	 * @param  {String} lowerBoundSymbol [the symbol of the first asset to include in the list]
	 * @param  {Number} limit [the maximum number of assets to return (max: 100)]
	 *
	 * @return {Promise<Asset[]>} the list of asset objects, ordered by symbol
	 */
	listAssets(lowerBoundSymbol, limit = API_CONFIG.LIST_ASSETS_DEFAULT_LIMIT) {
		if (!limit > API_CONFIG.LIST_ASSETS_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.LIST_ASSETS_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'list_assets', [assetId.toRaw(lowerBoundSymbol), uint32.toRaw(limit)]]);
	}

	/**
	 * Creates a new user-issued or market-issued asset. Many options can be changed later using `update_asset()`.
	 * Right now this function is difficult to use because you must provide raw JSON data
	 * structures for the options objects, and those include prices and asset ids.
	 * @method createAsset
	 * @param {String} accountIdOrName [the name or id of the account who will pay the fee and become the
	 * issuer of the new asset. This can be updated later]
	 * @param {String} symbol [the ticker symbol of the new asset]
	 * @param {Number} precision [the number of digits of precision to the right of the decimal point,
	 * must be less than or equal to 12]
	 * @param {Object} assetOption [asset options required for all new assets.
	 * Note that `core_exchange_rate` technically needs to store the asset ID of this new asset.
	 * Since this ID is not known at the time this operation is created, create this price as though the new asset has
	 * instance ID 1, and the chain will overwrite it with the new asset's ID.]
	 * @param {Object} bitassetOpts [options specific to BitAssets.
	 * This may be null unless the `market_issued` flag is set in common.flags]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction creating a new asset
	 */
	createAsset(accountIdOrName, symbol, precision, assetOption, bitassetOpts, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'create_asset',
			[
				string.toRaw(accountIdOrName),
				string.toRaw(symbol),
				uint8.toRaw(precision),
				options.toRaw(assetOption),
				optional(bitassetOptions).toRaw(bitassetOpts),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Update the core options on an asset.
	 * There are a number of options which all assets in the network use. These options are enumerated in the
	 * `asset_object::asset_options` struct. This command is used to update these options for an existing asset.
	 *
	 * @note This operation cannot be used to update BitAsset-specific options. For these options,
	 * `update_bitasset()` instead.
	 *
	 * @method updateAsset
	 * @param {String} assetIdOrName [the name or id of the asset to update]
	 * @param {String} newIssuerIdOrName [if changing the asset's issuer, the name or id of the new issuer.
	 * null if you wish to remain the issuer of the asset]
	 * @param {Object} newOptions [the new asset_options object, which will entirely replace the existing
	 * options]
	 * @param {Boolean} shouldDoBroadcastToNetwork [broadcast true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction updating the asset
	 */
	updateAsset(assetIdOrName, newIssuerIdOrName, newOptions, shouldDoBroadcastToNetwork) {
		isAssetIdOrName(assetIdOrName);
		isAccountIdOrName(newIssuerIdOrName);

		return this.wsRpc.call([0, 'update_asset',
			[
				string.toRaw(assetIdOrName),
				string.toRaw(newIssuerIdOrName),
				options.toRaw(newOptions),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Update the options specific to a BitAsset.
	 * BitAssets have some options which are not relevant to other asset types. This operation is used to update those
	 * options an existing BitAsset
	 *
	 * @see `update_asset()`
	 *
	 * @method updateBitasset
	 * @param {String} assetIdOrName [the name or id of the asset to update, which must be a market-issued asset]
	 * @param {Object} newBitasset [the new bitasset_options object, which will entirely replace the existing options]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction updating the bitasset
	 */
	updateBitasset(assetIdOrName, newBitasset, shouldDoBroadcastToNetwork) {
		isAssetIdOrName(assetIdOrName);
		return this.wsRpc.call([0, 'update_bitasset',
			[string.toRaw(assetIdOrName), bitassetOptions.toRaw(newBitasset), bool.toRaw(shouldDoBroadcastToNetwork)],
		]);
	}

	/**
	 * Update the set of feed-producing accounts for a BitAsset.
	 * BitAssets have price feeds selected by taking the median values of recommendations from a set of feed producers.
	 * This command is used to specify which accounts may produce feeds for a given BitAsset.
	 * @method updateAssetFeedProducers
	 * @param {String} assetIdOrName [the name or id of the asset to update]
	 * @param {Array<String>} newFeedProducers [a list of account names or ids which are authorized to produce feeds
	 * for the asset. This list will completely replace the existing list]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction updating the bitasset's feed producers
	 */
	updateAssetFeedProducers(assetIdOrName, newFeedProducers, shouldDoBroadcastToNetwork) {
		isAssetIdOrName(assetIdOrName);
		if (!newFeedProducers.every((idOrName) => !isAccountIdOrName(idOrName))) {
			throw new Error('Accounts should contain valid account names or ids');
		}
		return this.wsRpc.call([0, 'update_asset_feed_producers',
			[
				string.toRaw(assetIdOrName),
				vector(string).toRaw(newFeedProducers),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Publishes a price feed for the named asset.
	 * Price feed providers use this command to publish their price feeds for market-issued assets. A price feed is
	 * used to tune the market for a particular market-issued asset. For each value in the feed,
	 * the median across all committee_member feeds for that asset is calculated and the market
	 * for the asset is configured with the median of that value.
	 *
	 * The feed object in this command contains three prices: a call price limit, a short price limit,
	 * and a settlement price. The call limit price is structured as (collateral asset) / (debt asset)
	 * and the short limit price is structured as (asset for sale) / (collateral asset).
	 * Note that the asset IDs are opposite to each other, so if we're publishing a feed for USD,
	 * the call limit price will be ECHO/USD and the short limit price will be USD/ECHO. The settlement price may be
	 * flipped either direction, as long as it is a ratio between the market-issued asset and its collateral.
	 *
	 * @method publishAssetFeed
	 * @param {String} accountIdOrName [the account publishing the price feed]
	 * @param {String} assetIdOrName [the name or id of the asset whose feed we're publishing]
	 * @param {Object} priceOfFeed [object containing the three prices making up the feed]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction updating the price feed for the given asset
	 */
	publishAssetFeed(accountIdOrName, assetIdOrName, priceOfFeed, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		isAssetIdOrName(assetIdOrName);

		return this.wsRpc.call([0, 'publish_asset_feed',
			[
				string.toRaw(accountIdOrName),
				string.toRaw(assetIdOrName),
				priceFeed.toRaw(priceOfFeed),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Issue new shares of an asset.
	 * @method issueAsset
	 * @param {String} accountIdOrName [the name or id of the account to receive the new shares]
	 * @param {String} amount [the amount to issue, in nominal units]
	 * @param {String} assetTicker [the ticker symbol of the asset to issue]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction issuing the new shares
	 */
	issueAsset(accountIdOrName, amount, assetTicker, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'issue_asset',
			[
				string.toRaw(accountIdOrName),
				string.toRaw(amount),
				string.toRaw(assetTicker),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Returns information about the given asset.
	 * @method getAsset
	 * @param {String} assetIdOrName [the symbol or id of the asset in question]
	 *
	 * @returns {Promise<Object>} the information about the asset stored in the block chain
	 */
	getAsset(assetIdOrName) {
		isAssetIdOrName(assetIdOrName);
		return this.wsRpc.call([0, 'get_asset', [string.toRaw(assetIdOrName)]]);
	}

	/**
	 * Returns the BitAsset-specific data for a given asset.
	 * Market-issued assets's behavior are determined both by their "BitAsset Data" and
	 * their basic asset data, as returned by `get_asset()`.
	 * @method getBitassetData
	 * @param {String} bitassetIdOrName [the symbol or id of the BitAsset in question]
	 *
	 * @returns {Promise<Object>} the BitAsset-specific data for this asset
	 */
	getBitassetData(bitassetIdOrName) {
		return this.wsRpc.call([0, 'get_bitasset_data', [string.toRaw(bitassetIdOrName)]]);
	}

	/**
	 * Pay into the fee pool for the given asset.
	 * User-issued assets can optionally have a pool of the core asset which is automatically used to pay transaction
	 * fees for any transaction using that asset (using the asset's core exchange rate).
	 * This command allows anyone to deposit the core asset into this fee pool.
	 * @method fundAssetFeePool
	 * @param {String} fromAccountIdOrName [the name or id of the account sending the core asset]
	 * @param {String} assetIdOrName [the name or id of the asset whose fee pool you wish to fund]
	 * @param {String} amount [the amount of the core asset to deposit]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction funding the fee pool
	 */
	fundAssetFeePool(fromAccountIdOrName, assetIdOrName, amount, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(fromAccountIdOrName);
		isAssetIdOrName(assetIdOrName);

		return this.wsRpc.call([0, 'fund_asset_fee_pool',
			[
				string.toRaw(fromAccountIdOrName),
				string.toRaw(assetIdOrName),
				string.toRaw(amount),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Burns the given user-issued asset.
	 * This command burns the user-issued asset to reduce the amount in circulation.
	 *
	 * @note you cannot burn market-issued assets.
	 *
	 * @method reserveAsset
	 * @param {String} accountIdOrName [the account containing the asset you wish to burn]
	 * @param {String} amount [the amount to burn, in nominal units]
	 * @param {String} assetIdOrName [the name or id of the asset to burn]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction burning the asset
	 */
	reserveAsset(accountIdOrName, amount, assetIdOrName, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		isAssetIdOrName(assetIdOrName);

		return this.wsRpc.call([0, 'reserve_asset',
			[
				string.toRaw(accountIdOrName),
				string.toRaw(amount),
				string.toRaw(assetIdOrName),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Creates a committee_member object owned by the given account.
	 * An account can have at most one committee_member object.
	 * @method createCommitteeMember
	 * @param {String} accountIdOrName [the name or id of the account which is creating the committee_member]
	 * @param {String} url [a URL to include in the committee_member record in the blockchain. Clients may
	 * display this when showing a list of committee_members. May be blank]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true to broadcast the transaction on the network]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction registering a committee_member
	 */
	createCommitteeMember(accountIdOrName, url, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		if (!validateUrl(url) && url !== '') throw new Error('Url should be string and valid');

		return this.wsRpc.call([0, 'create_committee_member',
			[string.toRaw(accountIdOrName),	string.toRaw(url), bool.toRaw(shouldDoBroadcastToNetwork)],
		]);
	}

	/**
	 * Set your vote for the number of committee_members in the system.
	 * There are maximum values for each set in the blockchain parameters (currently defaulting to 1001).
	 * This setting can be changed at any time. If your account has a voting proxy set, your preferences will be ignored
	 * @method setDesiredCommitteeMemberCount
	 * @param {String} accountIdOrName [the name or id of the account to update]
	 * @param {Number} desiredNumberOfCommitteeMembers [the number]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction changing your vote proxy settings
	 */
	setDesiredCommitteeMemberCount(accountIdOrName, desiredNumberOfCommitteeMembers, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'set_desired_committee_member_count',
			[
				string.toRaw(accountIdOrName),
				uint16.toRaw(desiredNumberOfCommitteeMembers),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Returns information about the given `committee_member`.
	 * @method getCommitteeMember
	 * @param {String} accountIdOrName [the name or id of the committee_member account owner,
	 * or the id of the committee_member]
	 *
	 * @returns {Promise<Object>} the information about the committee_member stored in the block chain
	 */
	getCommitteeMember(accountIdOrName) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'get_committee_member', [string.toRaw(accountIdOrName)]]);
	}

	/**
	 * Lists all committee_members registered in the blockchain.
	 * This returns a list of all account names that own committee_members, and the associated committee_member id,
	 * sorted by name. This lists committee_members whether they are currently voted in or not.
	 * Use the `lowerbound` and limit parameters to page through the list. To retrieve all committee_members,
	 * start by setting `lowerbound` to the empty string ``, and then each iteration, pass
	 * the last committee_member name returned as the `lowerbound` for the next `list_committee_members()` call.
	 * @method listCommitteeMembers
	 * @param {String} lowerBoundName [the name of the first committee_member to return. If the named committee_member
	 * does not exist, the list will start at the committee_member that comes after `lowerbound`]
	 * @param {Number} limit [limit the maximum number of committee_members to return (max: 1000)]
	 *
	 * @returns {Promise<[string, string][]>} a list of committee_members mapping committee_member names
	 * to committee_member ids
	 */
	listCommitteeMembers(lowerBoundName, limit = API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT) {
		if (!limit > API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT) {
			throw new Error(`Limit should be capped at ${API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT}`);
		}

		return this.wsRpc.call([0, 'list_committee_members',
			[string.toRaw(lowerBoundName),	uint64.toRaw(limit)],
		]);
	}

	/**
	 * Vote for a given committee_member.
	 * An account can publish a list of all committee_memberes they approve of. This command allows you to add or
	 * remove committee_memberes from this list. Each account's vote is weighted according to the number of shares
	 * of the core asset owned by that account at the time the votes are tallied.
	 *
	 * @note you cannot vote against a committee_member, you can only vote for the committee_member
	 * or not vote for the committee_member.
	 *
	 * @method voteForCommitteeMember
	 * @param {String} votingAccountIdOrName [the name or id of the account who is voting with their shares]
	 * @param {String} ownerOfCommitteeMember [the name or id of the committee_member' owner account]
	 * @param {Boolean} approveYourVote [true if you wish to vote in favor of that committee_member,
	 * false to remove your vote in favor of that committee_member]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction changing your vote for the given committee_member
	 */
	voteForCommitteeMember(votingAccountIdOrName, ownerOfCommitteeMember, approveYourVote, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(votingAccountIdOrName);
		isAccountIdOrName(ownerOfCommitteeMember);

		return this.wsRpc.call([0, 'vote_for_committee_member',
			[
				string.toRaw(votingAccountIdOrName),
				string.toRaw(ownerOfCommitteeMember),
				bool.toRaw(approveYourVote),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Set the voting proxy for an account.
	 * If a user does not wish to take an active part in voting, they can choose
	 * to allow another account to vote their stake.
	 * Setting a vote proxy does not remove your previous votes from the blockchain, they remain there but are ignored.
	 * If you later null out your vote proxy, your previous votes will take effect again.
	 * This setting can be changed at any time.
	 * @method setVotingProxy
	 * @param {String} accountIdOrNameToUpdate [the name or id of the account to update]
	 * @param {String} votingAccountIdOrName [the name or id of an account authorized
	 * to vote account_to_modify's shares, or null to vote your own shares]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed transaction changing your vote proxy settings
	 */
	setVotingProxy(accountIdOrNameToUpdate, votingAccountIdOrName, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrNameToUpdate);
		isAccountIdOrName(votingAccountIdOrName);

		return this.wsRpc.call([0, 'set_voting_proxy',
			[
				string.toRaw(accountIdOrNameToUpdate),
				string.toRaw(votingAccountIdOrName),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Creates a transaction to propose a parameter change.
	 * Multiple parameters can be specified if an atomic change is desired.
	 * @method proposeParameterChange
	 * @param {String} accountIdOrName [the account paying the fee to propose the tx]
	 * @param {Number} expirationTime [timestamp specifying when the proposal will either take effect or expire]
	 * @param {Object} changeValues [the values to change; all other chain parameters are filled in with default values]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	proposeParameterChange(accountIdOrName, expirationTime, changeValues, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'propose_parameter_change',
			[
				string.toRaw(accountIdOrName),
				timePointSec.toRaw(expirationTime),
				variantObject.toRaw(changeValues),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Propose a fee change.
	 * @method proposeFeeChange
	 * @param {String} accountIdOrName [the account paying the fee to propose the tx]
	 * @param {Number} expirationTime [timestamp specifying when the proposal will either take effect or expire]
	 * @param {Object} changedValues [map of operation type to new fee. Operations may be specified by name or ID.
	 * The "scale" key changes the scale. All other operations will maintain current values]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	proposeFeeChange(accountIdOrName, expirationTime, changedValues, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'propose_fee_change',
			[
				string.toRaw(accountIdOrName),
				timePointSec.toRaw(expirationTime),
				variantObject.toRaw(changedValues),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Change sidechain config.
	 * @method changeSidechainConfig
	 * @param {String} accountIdOrName [the account id who changing side chain config]
	 * @param {Object} changedValues [the values to change]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	changeSidechainConfig(accountIdOrName, changedValues, shouldDoBroadcastToNetwork) {
		isAccountIdOrName(accountIdOrName);
		return this.wsRpc.call([0, 'change_sidechain_config',
			[
				string.toRaw(accountIdOrName),
				config.toRaw(changedValues),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * Returns info about a specified block.
	 * @method getBlock
	 * @param  {Number} blockNum [height of the block to retrieve]
	 *
	 * @return {Promise<Object | undefined>} info about the block, or undefined if not found
	 */
	getBlock(blockNum) {
		return this.wsRpc.call([0, 'get_block', [uint32.toRaw(blockNum)]]);
	}

	/**
	 * Returns block virtual ops by number
	 * @method getBlockVirtualOps
	 * @param  {Number} blockNum [height of the block to retrieve]
	 *
	 * @return {Promise<Object[]>} info about operation history object
	 */
	getBlockVirtualOps(blockNum) {
		return this.wsRpc.call([0, 'get_block_virtual_ops', [uint32.toRaw(blockNum)]]);
	}

	/**
	 * Returns the number of accounts registered on the blockchain.
	 * @method getAccountCount
	 *
	 * @return {Promise<number | string>} the number of registered accounts
	 */
	getAccountCount() {
		return this.wsRpc.call([0, 'get_account_count', []]);
	}

	/**
	 * Returns the block chain's slowly-changing settings.
	 * This object contains all of the properties of the blockchain that are fixed
	 * or that change only once per maintenance interval (daily) such as the
	 * current list of committee_members, block interval, etc.
	 *
	 * @see `get_dynamic_global_properties()` for frequently changing properties
	 *
	 * @method getGlobalProperties
	 *
	 * @return {Promise<Object>} the global properties
	 */
	getGlobalProperties() {
		return this.wsRpc.call([0, 'get_global_properties', []]);
	}

	/**
	 * Returns the block chain's rapidly-changing properties.
	 * The returned object contains information that changes every block interval
	 * such as the head block number, etc.
	 *
	 * @see `get_global_properties()` for less-frequently changing properties
	 *
	 * @method getDynamicGlobalProperties
	 *
	 * @return {Promise<Object>} the dynamic global properties
	 */
	getDynamicGlobalProperties() {
		return this.wsRpc.call([0, 'get_dynamic_global_properties', []]);
	}

	/**
	 * Returns the blockchain object corresponding to the given id.
	 * This generic function can be used to retrieve any object from the blockchain
	 * that is assigned an ID. Certain types of objects have specialized convenience
	 * functions to return their objects -- e.g., assets have `get_asset()`, accounts
	 * have `get_account()`, but this function will work for any object.
	 * @method getObject
	 * @param {String} objectId [the id of the object to return]
	 *
	 * @returns {Promise<any>} the requested object
	 */
	getObject(objectId) {
		return this.wsRpc.call([0, 'get_object', [anyObjectId.toRaw(objectId)]]);
	}

	/**
	 * @ingroup Transaction Builder API
	 *
	 * Create a new transaction builder.
	 * @method beginBuilderTransaction
	 *
	 * @returns {Promise<Number>} handle of the new transaction builder
	 */
	beginBuilderTransaction() {
		return this.wsRpc.call([0, 'begin_builder_transaction', []]);
	}

	/**
	 * @ingroup Transaction Builder API
	 *
	 * Append a new operation to a transaction builder.
	 * @method addOperationToBuilderTransaction
	 * @param {Number} transactionTypeHandle [handle of the transaction builder]
	 * @param {Array<String>} newOperation [the operation in JSON format]
	 *
	 * @returns {Promise<void>}
	 */
	addOperationToBuilderTransaction(transactionTypeHandle, newOperation) {
		return this.wsRpc.call([0, 'add_operation_to_builder_transaction',
			[uint16.toRaw(transactionTypeHandle), operation.toRaw(newOperation)],
		]);
	}

	/**
	 * @ingroup Transaction Builder API
	 *
	 * Replace an operation in a transaction builder with a new operation.
	 * @method replaceOperationInBuilderTransaction
	 * @param {Number} transactionTypeHandle [handle of the transaction builder]
	 * @param {Number} unsignedOperation [the index of the old operation in the builder to be replaced]
	 * @param {Array<String>} newOperation [the new operation in JSON format]
	 *
	 * @returns {Promise<void>}
	 */
	replaceOperationInBuilderTransaction(transactionTypeHandle, unsignedOperation, newOperation) {
		return this.wsRpc.call([0, 'replace_operation_in_builder_transaction',
			[
				uint16.toRaw(transactionTypeHandle),
				uint64.toRaw(unsignedOperation),
				operation.toRaw(newOperation),
			],
		]);
	}

	/**
	 * @ingroup Transaction Builder API
	 *
	 * Calculate and update fees for the operations in a transaction builder.
	 * @method setFeesOnBuilderTransaction
	 * @param {Number} transactionTypeHandle [handle of the transaction builder]
	 * @param {String} feeAsset [name or ID of an asset that to be used to pay fees]
	 *
	 * @returns {Promise<Asset>} total fees
	 */
	setFeesOnBuilderTransaction(transactionTypeHandle, feeAsset) {
		isAssetIdOrName(feeAsset);
		return this.wsRpc.call([0, 'set_fees_on_builder_transaction',
			[uint16.toRaw(transactionTypeHandle), string.toRaw(feeAsset)],
		]);
	}

	/**
	 * @ingroup Transaction Builder API
	 *
	 * Show content of a transaction builder.
	 * @method previewBuilderTransaction
	 * @param {Number} transactionTypeHandle [handle of the transaction builder]
	 *
	 * @returns {Promise<Object>} a transaction
	 */
	previewBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'preview_builder_transaction', [uint64.toRaw(transactionTypeHandle)]]);
	}

	/**
	 * @ingroup Transaction Builder API
	 *
	 * Sign the transaction in a transaction builder and optionally broadcast to the network.
	 * @method signBuilderTransaction
	 * @param {Number} transactionTypeHandle [handle of the transaction builder]
	 * @param {Boolean} shouldDoBroadcastToNetwork [whether to broadcast the signed transaction to the network]
	 *
	 * @returns {Promise<SignedTransaction>} a signed transaction
	 */
	signBuilderTransaction(transactionTypeHandle, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'sign_builder_transaction',
			[uint16.toRaw(transactionTypeHandle), bool.toRaw(shouldDoBroadcastToNetwork)],
		]);
	}

	/**
	 * @ingroup Transaction Builder API
	 *
	 * Create a proposal containing the operations in a transaction builder (create a new `proposal_create` operation,
	 * then replace the transaction builder with the new operation), then sign the transaction and optionally broadcast
	 * to the network.
	 * Note: this command is buggy because unable to specify proposer. It will be deprecated in a future release.
	 * Please use `propose_builder_transaction2()` instead.
	 * @method proposeBuilderTransaction
	 * @param {Number} transactionTypeHandle [handle of the transaction builder]
	 * @param {String} expirationTime [when the proposal will expire]
	 * @param {Number} reviewPeriod [review period of the proposal in seconds]
	 * @param {Boolean} shouldDoBroadcastToNetwork [whether to broadcast the signed transaction to the network]
	 *
	 * @returns {Promise<SignedTransaction>} a signed transaction
	 */
	proposeBuilderTransaction(transactionTypeHandle, expirationTime, reviewPeriod, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'propose_builder_transaction',
			[
				uint16.toRaw(transactionTypeHandle),
				timePointSec.toRaw(expirationTime),
				uint32.toRaw(reviewPeriod),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * @ingroup Transaction Builder API
	 *
	 * Create a proposal containing the operations in a transaction builder (create a new proposal_create operation,
	 * then replace the transaction builder with the new operation),
	 * then sign the transaction and optionally broadcast to the network.
	 * @method proposeBuilderTransaction2
	 * @param {Number} transactionTypeHandle [handle of the transaction builder]
	 * @param {String} accountIdOrName [name or ID of the account who would pay fees for creating the proposal]
	 * @param {String} expirationTime [when the proposal will expire]
	 * @param {Number} reviewPeriod [review period of the proposal in seconds]
	 * @param {Boolean} shouldDoBroadcastToNetwork [whether to broadcast the signed transaction to the network]
	 *
	 * @returns {Promise<Object>} a signed transaction
	 */
	proposeBuilderTransaction2(
		transactionTypeHandle,
		accountIdOrName,
		expirationTime,
		reviewPeriod,
		shouldDoBroadcastToNetwork,
	) {
		isAccountIdOrName(accountIdOrName);

		return this.wsRpc.call([0, 'propose_builder_transaction2',
			[
				uint16.toRaw(transactionTypeHandle),
				string.toRaw(accountIdOrName),
				timePointSec.toRaw(expirationTime),
				uint32.toRaw(reviewPeriod),
				bool.toRaw(shouldDoBroadcastToNetwork),
			],
		]);
	}

	/**
	 * @ingroup Transaction Builder API
	 *
	 * Destroy a transaction builder.
	 * @method removeBuilderTransaction
	 * @param {Number} transactionTypeHandle [handle of the transaction builder]
	 *
	 * @returns {Promise<void>}
	 */
	removeBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'remove_builder_transaction', [uint16.toRaw(transactionTypeHandle)]]);
	}

	/**
	 * Converts a signed_transaction in JSON form to its binary representation.
	 * @method serializeTransaction
	 * @param {Object} tr [the transaction to serialize]
	 *
	 * @returns {Promise<String>} the binary form of the transaction. It will not be hex encoded,
	 * this returns a raw string that may have null characters embedded in it
	 */
	serializeTransaction(tr) {
		return this.wsRpc.call([0, 'serialize_transaction', [signedTransaction.toRaw(tr)]]);
	}

	/**
	 * Signs a transaction.
	 * Given a fully-formed transaction that is only lacking signatures, this signs
	 * the transaction with the necessary keys and optionally broadcasts the transaction.
	 * @method signTransaction
	 * @param {Object} tr [the unsigned transaction]
	 * @param {Boolean} shouldDoBroadcastToNetwork [true if you wish to broadcast the transaction]
	 *
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	signTransaction(tr, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'sign_transaction',
			[transaction.toRaw(tr), bool.toRaw(shouldDoBroadcastToNetwork)],
		]);
	}

	/**
	 * Returns an uninitialized object representing a given blockchain operation.
	 * This returns a default-initialized object of the given type; it can be used during early development of the
	 * wallet when we don't yet have custom commands for creating all of the operations the blockchain supports.
	 * Any operation the blockchain supports can be created using the transaction builder's
	 * `add_operation_to_builder_transaction()`, but to do that from the CLI you need to know what the JSON form of the
	 * operation looks like. This will give you a template you can fill in. It's better than nothing.
	 * @method getPrototypeOperation
	 * @param {String} operationType [the type of operation to return, must be one of the
	 * operations defined in `graphene/chain/operations.hpp` (e.g., "global_parameters_update_operation")]
	 *
	 * @returns {Promise<Operation>} a default-constructed operation of the given type
	 */
	getPrototypeOperation(operationType) {
		return this.wsRpc.call([0, 'get_prototype_operation', [string.toRaw(operationType)]]);
	}

}

export default WalletAPI;
