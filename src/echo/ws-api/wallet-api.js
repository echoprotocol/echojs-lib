import * as serializers from '../../serializers';
import { API_CONFIG } from '../../constants';
import ReconnectionWebSocket from '../ws/reconnection-websocket';
import {
	isAccountId,
	isAccountIdOrName,
	isAssetIdOrName,
	isMethodExists,
	isAccountName,
	isContractResultId,
	validateUrl,
	isOldPrivateKey,
	isOperationPrototypeExists,
	isNotEmptyString,
	isAssetName,
	isContractCode,
	isValidAmount,
	isBoolean,
	isAssetId,
	isPublicKey,
	isUInt64,
	isCommitteeMemberId,
} from '../../utils/validators';

const { ethAddress, accountListing } = serializers.protocol;
const { vector, optional } = serializers.collections;
const {
	privateKey,
	publicKey,
	ripemd160,
	asset: assetSerializer,
} = serializers.chain;
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
	uint256,
} = serializers.basic.integers;

const {
	timePointSec,
	variantObject,
	string,
	bool,
} = serializers.basic;

const {
	operation,
	wallet,
	signedTransaction,
	transaction,
} = serializers;

const {
	accountId,
	contractId,
	erc20TokenId,
	proposalId,
	assetId,
	committeeMemberId,
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

	constructor() { this.wsRpc = new ReconnectionWebSocket(); }

	/**
	 * Init params and connect to chain.
	 * @param {string} url remote node address
	 * @param {Parameters<ReconnectionWebSocket['connect']>1} connectionOptions connection params.
	 * @returns {Promise<void>}
	 */
	async connect(url, connectionOptions) { await this.wsRpc.connect(url, connectionOptions); }

	/**
	 * Exit from current wallet.
	 * @returns {Promise<never>}
	 */
	exit() { return this.wsRpc.call([0, 'exit', []]); }

	/**
	 * Returns a list of all commands supported by the wallet API.
	 * This lists each command, along with its arguments and return types.
	 * For more detailed help on a single command, use `get_help()`
	 * @returns {Promise<string>} a multi-line string suitable for displaying on a terminal
	 */
	help() { return this.wsRpc.call([0, 'help', []]); }

	/**
	 * Returns detailed help on a single API command.
	 * @param {string} method the name of the API command you want help with
	 * @returns {Promise<string>} a multi-line string suitable for displaying on a terminal
	 */
	helpMethod(method) {
		if (!isMethodExists(method)) return Promise.reject(new Error('This method does not exists'));
		return this.wsRpc.call([0, 'help_method', [string.toRaw(method)]]);
	}

	/**
	 * Returns info about head block, chain_id, maintenance, participation,
	 * current active witnesses and committee members.
	 * @returns {Promise<any>} runtime info about the blockchain
	 */
	info() { return this.wsRpc.call([0, 'info', []]); }

	/**
	 * Returns info such as client version, git version of graphene/fc, version of boost, openssl.
	 * @returns {Promise<any>} compile time info and client and dependencies versions
	 */
	about() { return this.wsRpc.call([0, 'about', []]); }

	/**
	 * Add nodes to the network
	 * @param {string} nodes nodes for adding
	 * @returns {Promise<void>}
	 */
	networkAddNodes(nodes) { return this.wsRpc.call([0, 'network_add_nodes', [vector(string).toRaw(nodes)]]); }

	/**
	 * Get peers connected to network.
	 * @returns {Promise<any[]>} peers connected to network
	 */
	networkGetConnectedPeers() { return this.wsRpc.call([0, 'network_get_connected_peers', []]); }

	/**
	 * Checks whether the wallet has just been created and has not yet had a password set.
	 * Calling `set_password` will transition the wallet to the locked state.
	 * @returns {Promise<boolean>} true if the wallet is new
	 */
	isNew() { return this.wsRpc.call([0, 'is_new', []]); }

	/**
	 * Checks whether the wallet is locked (is unable to use its private keys).
	 * This state can be changed by calling `lock()` or `unlock()`.
	 * @returns {Promise<boolean>} true if the wallet is locked
	 */
	isLocked() { return this.wsRpc.call([0, 'is_locked', []]); }

	/**
	 * Locks the wallet immediately.
	 * @returns {Promise<void>}
	 */
	lock() { return this.wsRpc.call([0, 'lock', []]); }

	/**
	 * Unlocks the wallet.
	 * The wallet remain unlocked until the `lock` is called or the program exits.
	 * @param {string} password the password previously set with `set_password()`,
	 * in the wallet it should be input interactively
	 * @returns {Promise<void>}
	 */
	unlock(password) { return this.wsRpc.call([0, 'unlock', [string.toRaw(password)]]); }

	/**
	 * Sets a new password on the wallet.
	 * The wallet must be either 'new' or 'unlocked' to execute this command.
	 * @param {string} password the password, should be input automatically in the wallet
	 * @returns {Promise<void>}
	 */
	setPassword(password) { return this.wsRpc.call([0, 'set_password', [string.toRaw(password)]]); }

	/**
	 * Create new EdDSA keypair encoded in base58.
	 * @returns {Promise<[string, string]>} new private and public key
	 */
	createEddsaKeypair() { return this.wsRpc.call([0, 'create_eddsa_keypair', []]); }

	/**
	 * Dumps all private keys owned by the wallet.
	 * The keys are printed in WIF format. You can import these keys into another wallet using `import_key()`
	 * @returns {Promise<[string, string][]>} a map containing the private keys, indexed by their public key
	 */
	dumpPrivateKeys() { return this.wsRpc.call([0, 'dump_private_keys', []]); }

	/**
	 * Dumps private key from old b58 format to new WIF.
	 * The keys are printed in WIF format. You can import these key into another wallet using `import_key()`.
	 * @param {string} accountPrivateKey old b58 format eddsa private_key
	 * @returns {Promise<string>} string new in WIF eddsa private key
	 */
	oldKeyToWif(accountPrivateKey) {
		if (!isOldPrivateKey(accountPrivateKey)) return Promise.reject(new Error('Invalid private key'));
		return this.wsRpc.call([0, 'old_key_to_wif', [string.toRaw(accountPrivateKey)]]);
	}

	/**
	 * Imports the private key for an existing account.
	 * The private key must match either an owner key or an active key for the named account.
	 * @see {@link WalletAPI['dumpPrivateKeys']}
	 * @param {string} accountNameOrId the account owning the key
	 * @param {string} privateKeyWif the private key, should be input interactively
	 * @returns {Promise<boolean>} true if the key was imported
	 */
	importKey(accountNameOrId, privateKeyWif) {
		if (!isAccountIdOrName(accountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'import_key', [string.toRaw(accountNameOrId), privateKey.toRaw(privateKeyWif)]]);
	}

	/**
	 * Imports accounts from a blockchain wallet file. Current wallet file must be unlocked to perform the import.
	 * @param {string} filename the blockchain wallet file to import
	 * @param {string} password the password to encrypt the blockchain wallet file
	 * @returns {[string, boolean][]} a map containing the accounts found and whether imported
	 */
	importAccounts(filename, password) {
		return this.wsRpc.call([0, 'import_accounts', [string.toRaw(filename), string.toRaw(password)]]);
	}

	/**
	 * Imports from a blockchain wallet file, find keys that were bound to a given account name on
	 * the blockchain, rebind them to an account name on the chain.
	 * Current wallet file must be unlocked to perform the import.
	 * @param {string} filename the blockchain wallet file to import
	 * @param {string} password the password to encrypt the blockchain wallet file
	 * @param {string} srcAccountName name of the account on blockchain
	 * @param {string} destAccountName name of the account on blockchain, can be same or different
	 * to `src_account_name`
	 * @returns {Promise<boolean>} whether the import has succeeded
	 */
	importAccountKeys(filename, password, srcAccountName, destAccountName) {
		if (!isAccountName(srcAccountName)) {
			return Promise.reject(new Error('srcAccount name should be string and valid'));
		}
		if (!isAccountName(destAccountName)) {
			return Promise.reject(new Error('destAccount name should be string and valid'));
		}
		return this.wsRpc.call([0, 'import_account_keys', [
			string.toRaw(filename),
			string.toRaw(password),
			string.toRaw(srcAccountName),
			string.toRaw(destAccountName),
		]]);
	}

	/**
	 * This call will construct transaction(s) that will claim all balances controlled
	 * by 'wif_keys' and deposit them into the given account. 'wif_key' should be input interactively
	 * @param {string} accountNameOrId name or ID of an account that to claim balances to
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @param {string} wifKeys private WIF keys of balance objects to claim balances from
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	importBalance(accountNameOrId, shouldDoBroadcastToNetwork, wifKeys) {
		if (!isAccountIdOrName(accountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'import_balance', [
			string.toRaw(accountNameOrId),
			bool.toRaw(shouldDoBroadcastToNetwork),
			vector(privateKey).toRaw(wifKeys),
		]]);
	}

	/**
	 * Suggests a safe brain key to use for creating your account. `create_account_with_brain_key()` requires you
	 * to specify a 'brain key', a long passphrase that provides enough entropy to generate cyrptographic keys.
	 * This function will suggest a suitably random string that should be easy to write down
	 * (and, with effort, memorize).
	 * @returns {Promise<any>} a suggested brain_key
	 */
	suggestBrainKey() { return this.wsRpc.call([0, 'suggest_brain_key', []]); }

	/**
	 * Derive any number of *possible* owner keys from a given brain key.
	 * NOTE: These keys may or may not match with the owner keys of any account.
	 * This function is merely intended to assist with account or key recovery.
	 * @see {@link WalletAPI['suggestBrainKey']}
	 * @param {string} brainKey brain key
	 * @param {number} numberOfDesiredKeys number of desired keys
	 * @returns {Promise<any[]>} A list of keys that are deterministically derived from the brainkey
	 */
	deriveKeysFromBrainKey(brainKey, numberOfDesiredKeys) {
		if (numberOfDesiredKeys < 1) return Promise.reject(new Error('Number should be positive integer'));
		return this.wsRpc.call([0, 'derive_keys_from_brain_key', [
			string.toRaw(brainKey),
			int64.toRaw(numberOfDesiredKeys),
		]]);
	}

	/**
	 * Determine whether a textual representation of a public key (in Base-58 format) is *currently* linked
	 * to any *registered* (i.e. non-stealth) account on the blockchain.
	 * @param {string} accountPublicKey public key
	 * @returns {Promise<boolean>} Whether a public key is known
	 */
	isPublicKeyRegistered(accountPublicKey) {
		return this.wsRpc.call([0, 'is_public_key_registered', [publicKey.toRaw(accountPublicKey)]]);
	}

	/**
	 * This method is used to convert a JSON transaction to it's transaction ID.
	 * @param {any} tr the singed transaction
	 * @returns {Promise<TransactionIdType>} transaction id string
	 */
	getTransactionId(tr) { return this.wsRpc.call([0, 'get_transaction_id', [signedTransaction.toRaw(tr)]]); }

	/**
	 * Get the WIF private key corresponding to a public key. The private key must already be in the wallet.
	 * @param {string} accountPublicKey public key of an account
	 * @returns {Promise<string>} private key of this account
	 */
	getPrivateKey(accountPublicKey) {
		return this.wsRpc.call([0, 'get_private_key', [publicKey.toRaw(accountPublicKey)]]);
	}

	/**
	 * Loads a specified Graphene wallet. The current wallet is closed before the new wallet is loaded.
	 *
	 * **WARNING:** This does not change the filename that will be used for future wallet writes,
	 * so this may cause you to overwrite your original wallet unless you also call `setWalletFilename` method
	 * @param {string} walletFilename the filename of the wallet JSON file to load.
	 * If `wallet_filename` is empty, it reloads the existing wallet file
	 * @returns {Promise<boolean>} true if the specified wallet is loaded
	 */
	loadWalletFile(walletFilename) { return this.wsRpc.call([0, 'load_wallet_file', [string.toRaw(walletFilename)]]); }

	/**
	 * Transforms a brain key to reduce the chance of errors when re-entering the key from memory.
	 * This takes a user-supplied brain key and normalizes it into the form used for generating private keys.
	 * In particular, this upper-cases all ASCII characters and collapses multiple spaces into one.
	 * @param {string} brainKey the brain key as supplied by the user
	 * @returns {Promise<string>} the brain key in its normalized form
	 */
	normalizeBrainKey(brainKey) { return this.wsRpc.call([0, 'normalize_brain_key', [string.toRaw(brainKey)]]); }

	/**
	 * Saves the current wallet to the given filename.
	 *
	 * **WARNING:** This does not change the wallet filename that will be used for future writes,
	 * so think of this function as 'Save a Copy As...' instead of 'Save As...'.
	 * Use `setWalletFilename` method to make the filename persist.
	 * @param {string} walletFilename the filename of the new wallet JSON file to create or overwrite.
	 * If `wallet_filename` is empty, save to the current filename
	 * @returns {Promise<void>}
	 */
	saveWalletFile(walletFilename) { return this.wsRpc.call([0, 'save_wallet_file', [string.toRaw(walletFilename)]]); }

	/**
	 * Lists all accounts controlled by this wallet.
	 * This returns a list of the full account objects for all accounts whose private keys we possess.
	 * @returns {Promise<any[]>} a list of account objects
	 */
	listMyAccounts() { return this.wsRpc.call([0, 'list_my_accounts', []]); }

	/**
	 * Lists all accounts registered in the blockchain.
	 * This returns a list of all account names and their account ids, sorted by account name.
	 * Use the `lowerbound` and limit parameters to page through the list. To retrieve all accounts,
	 * start by setting `lowerbound` to the empty string `""`, and then each iteration, pass
	 * the last account name returned as the `lowerbound` for the next `listAccounts` call.
	 * @param {string} lowerbound the name of the first account to return. If the named account does not exist,
	 * the list will start at the account that comes after `lowerbound`
	 * @param {number} limit limit the maximum number of accounts to return (max: 1000)
	 * @returns {Promise<[string, string][]>} a list of accounts mapping account names to account ids
	 */
	listAccounts(lowerbound, limit = API_CONFIG.LIST_ACCOUNTS_DEFAULT_LIMIT) {
		if (!isAccountName(lowerbound)) return Promise.reject(new Error('Account name should be string and valid'));
		if (!limit > API_CONFIG.LIST_ACCOUNTS_MAX_LIMIT) {
			return Promise.reject(new Error(`Limit should be capped at ${API_CONFIG.LIST_ACCOUNTS_MAX_LIMIT}`));
		}
		return this.wsRpc.call([0, 'list_accounts', [string.toRaw(lowerbound), uint32.toRaw(limit)]]);
	}

	/**
	 * List the balances of an account or a contract.
	 * @param {string} accountNameOrId id the id of either an account or a contract
	 * @returns {Promise<Asset[]>} a list of the given account/contract balances
	 */
	listAccountBalances(accountNameOrId) {
		if (!isAccountIdOrName(accountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'list_account_balances', [string.toRaw(accountNameOrId)]]);
	}

	/**
	 * List the balances of an account or a contract.
	 * @param {string} idOfAccount id the id of either an account or a contract
	 * @returns {Promise<Asset[]>} a list of the given account/contract balances
	 */
	listIdBalances(idOfAccount) { return this.wsRpc.call([0, 'list_id_balances', [accountId.toRaw(idOfAccount)]]); }

	/**
	 * Registers a third party's account on the blockckain.
	 * This function is used to register an account for which you do not own the private keys.
	 * When acting as a registrar, an end user will generate their own private keys and send you the public keys.
	 * The registrar will use this function to register the account on behalf of the end user.
	 * @see {@link WalletAPI['createAccountWithBrainKey']}
	 * @param {string} name the name of the account, must be unique on the blockchain.
	 * Shorter names are more expensive to register; the rules are still in flux,
	 * but in general names of more than 8 characters with at least one digit will be cheap
	 * @param {string} activeKey the active key for the new account
	 * @param {string} accountNameOrId the account which will pay the fee to register the user
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction registering the account
	 */
	registerAccount(name, activeKey, accountNameOrId, shouldDoBroadcastToNetwork) {
		if (!isAccountName(name)) return Promise.reject(new Error('Name should be string and valid'));
		if (!isAccountIdOrName(accountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'register_account', [
			string.toRaw(name),
			publicKey.toRaw(activeKey),
			string.toRaw(accountNameOrId),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Creates a new account and registers it on the blockchain.
	 * @see {@link WalletAPI['suggestBrainKey']}
	 * @see {@link WalletAPI['registerAccount']}
	 * @param {string} brainKey the brain key used for generating the account's private keys
	 * @param {string} accountName the name of the account, must be unique on the blockchain.
	 * Shorter names are more expensive to register; the rules are still in flux,
	 * but in general names of more than 8 characters with at least one digit will be cheap
	 * @param {string} accountNameOrId the account which will pay the fee to register the user
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction registering the account
	 */
	createAccountWithBrainKey(brainKey, accountName, accountNameOrId, shouldDoBroadcastToNetwork) {
		if (!isAccountName(accountName)) return Promise.reject(new Error('Name should be string and valid'));
		if (!isAccountIdOrName(accountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'create_account_with_brain_key', [
			string.toRaw(brainKey),
			string.toRaw(accountName),
			string.toRaw(accountNameOrId),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Upload/Create a contract.
	 * @param {string} accountNameOrId name of the account creating the contract
	 * @param {string} contractCode code of the contract
	 * @param {number} amount the amount of asset transferred to the contract
	 * @param {string} assetType the type of the asset transferred to the contract
	 * @param {string} supportedAssetId the asset that can be used to create/call the contract
	 * (see https://echo-dev.io/developers/smart-contracts/solidity/introduction/#flag-of-supported-asset)
	 * @param {boolean} useEthereumAssetAccuracy whether to use the ethereum asset accuracy
	 * (see https://echo-dev.io/developers/smart-contracts/solidity/introduction/#flag-of-using-ethereum-accuracy)
	 * @param {boolean} shouldSaveToWallet whether to save the contract to the wallet
	 * @returns {Promise<any>} the signed transaction creating the contract
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
		if (!isAccountIdOrName(accountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isContractCode(contractCode)) return Promise.reject(new Error('Byte code should be string and valid'));
		return this.wsRpc.call([0, 'create_contract', [
			string.toRaw(accountNameOrId),
			string.toRaw(contractCode),
			uint64.toRaw(amount),
			assetId.toRaw(assetType),
			assetId.toRaw(supportedAssetId),
			bool.toRaw(useEthereumAssetAccuracy),
			bool.toRaw(shouldSaveToWallet),
		]]);
	}

	/**
	 * Call a contract.
	 * @param {string} accountNameOrId name of the account calling the contract
	 * @param {string} idOfContract the id of the contract to call
	 * @param {string} contractCode the hash of the method to call
	 * @param {number} amount the amount of asset transferred to the contract
	 * @param {string} assetType the type of the asset transferred to the contract
	 * @param {boolean} shouldSaveToWallet whether to save the contract call to the wallet
	 * @returns {Promise<any>} the signed transaction calling the contract
	 */
	callContract(
		accountNameOrId,
		idOfContract,
		contractCode,
		amount,
		assetType,
		shouldSaveToWallet,
	) {
		if (!isAccountIdOrName(accountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isContractCode(contractCode)) return Promise.reject(new Error('Byte code should be string and valid'));
		return this.wsRpc.call([0, 'call_contract', [
			string.toRaw(accountNameOrId),
			contractId.toRaw(idOfContract),
			string.toRaw(contractCode),
			uint64.toRaw(amount),
			assetId.toRaw(assetType),
			bool.toRaw(shouldSaveToWallet),
		]]);
	}

	/**
	 * Fund feepool of contract.
	 * @param {string} accountNameOrId name of the account which fund contract's feepool
	 * @param {string} idOfContract the id of the contract's feepool
	 * @param {number} amount the amount of asset transferred to the contract in default `asset_id_type()`
	 * @param {boolean} shouldDoBroadcastToNetwork whether to broadcast the fund contract operation to the network
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	contractFundFeePool(accountNameOrId, idOfContract, amount, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'contract_fund_fee_pool', [
			string.toRaw(accountNameOrId),
			contractId.toRaw(idOfContract),
			uint64.toRaw(amount),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Get the result of contract execution.
	 * @param {string} contractResultId the id of the contract result
	 * @returns {Promise<any>} the result of the contract
	 */
	getContractResult(contractResultId) {
		if (!isContractResultId(contractResultId)) {
			return Promise.reject(new Error('Contract resultId should be string and valid'));
		}
		return this.wsRpc.call([0, 'get_contract_result', [string.toRaw(contractResultId)]]);
	}

	/**
	 * Transfer an amount from one account to another.
	 * @param {string} fromAccountNameOrId the name or id of the account sending the funds
	 * @param {string} toAccountNameOrId the name or id of the account receiving the funds
	 * @param {string} amount the amount to send (in nominal units -- to send half of a BTS, specify 0.5)
	 * @param {string} assetIdOrName the symbol or id of the asset to send
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction transferring funds
	 */
	transfer(fromAccountNameOrId, toAccountNameOrId, amount, assetIdOrName, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(fromAccountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isAccountIdOrName(toAccountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isValidAmount(amount)) return Promise.reject(new Error('Invalid number'));
		if (!isAssetIdOrName(assetIdOrName)) {
			return Promise.reject(new Error('Assets id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'transfer', [
			string.toRaw(fromAccountNameOrId),
			string.toRaw(toAccountNameOrId),
			string.toRaw(amount),
			string.toRaw(assetIdOrName),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * This method works just like transfer, except it always broadcasts and
	 * returns the transaction ID along with the signed transaction.
	 * @param {string} fromAccountNameOrId the name or id of the account sending the funds
	 * @param {string} toAccountNameOrId the name or id of the account receiving the funds
	 * @param {string} amount the amount to send (in nominal units -- to send half of a BTS, specify 0.5)
	 * @param {string} assetIdOrName the symbol or id of the asset to send
	 * @returns {Promise<any[]>} the transaction ID along with the signed transaction
	 */
	transfer2(fromAccountNameOrId, toAccountNameOrId, amount, assetIdOrName) {
		if (!isAccountIdOrName(fromAccountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isAccountIdOrName(toAccountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isValidAmount(amount)) return Promise.reject(new Error('Invalid number'));
		if (!isAssetIdOrName(assetIdOrName)) {
			return Promise.reject(new Error('Assets id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'transfer2', [
			string.toRaw(fromAccountNameOrId),
			string.toRaw(toAccountNameOrId),
			string.toRaw(amount),
			string.toRaw(assetIdOrName),
		]]);
	}

	/**
	 * Whitelist and blacklist accounts, primarily for transacting in whitelisted assets.
	 * Accounts can freely specify opinions about other accounts, in the form of either whitelisting or blacklisting
	 * them. This information is used in chain validation only to determine whether an account is authorized to transact
	 * in an asset type which enforces a whitelist, but third parties can use this information for other uses as well,
	 * as long as it does not conflict with the use of whitelisted assets.
	 *
	 * An asset which enforces a whitelist specifies a list of accounts to maintain its whitelist, and a list of
	 * accounts to maintain its blacklist. In order for a given account A to hold and transact in a whitelisted asset S,
	 * A must be whitelisted by at least one of S's whitelist_authorities and blacklisted by none of S's
	 * blacklist_authorities. If A receives a balance of S, and is later removed from the whitelist(s) which allowed it
	 * to hold S, or added to any blacklist S specifies as authoritative, A's balance of S will be frozen until A's
	 * authorization is reinstated.
	 * @param {string} authorizingAccount the account who is doing the whitelisting
	 * @param {string} accountToList the account being whitelisted
	 * @param {number} newListingStatus the new whitelisting status
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction changing the whitelisting status
	 */
	whitelistAccount(authorizingAccount, accountToList, newListingStatus, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(authorizingAccount)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isAccountIdOrName(accountToList)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'whitelist_account', [
			string.toRaw(authorizingAccount),
			string.toRaw(accountToList),
			accountListing.toRaw(newListingStatus),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Get information about a vesting balance object.
	 * @param {string} accountNameOrId an account name, account ID, or vesting balance object ID
	 * @returns {Promise<any[]>} vesting balance object with info
	 */
	getVestingBalances(accountNameOrId) {
		if (!isAccountIdOrName(accountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'get_vesting_balances', [string.toRaw(accountNameOrId)]]);
	}

	/**
	 * Withdraw a vesting balance.
	 * @param {string} witnessAccountNameOrId the account name of the witness, also accepts account ID or
	 * vesting balance ID type
	 * @param {string} amount the amount to withdraw
	 * @param {string} assetSymbol the symbol of the asset to withdraw
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the transaction
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	withdrawVesting(witnessAccountNameOrId, amount, assetSymbol, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(witnessAccountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isValidAmount(amount)) {
			return Promise.reject(new Error('Invalid amount'));
		}
		return this.wsRpc.call([0, 'withdraw_vesting', [
			string.toRaw(witnessAccountNameOrId),
			string.toRaw(amount),
			string.toRaw(assetSymbol),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Returns information about the given account.
	 * @param {string} accountNameOrId returns information about the given account
	 * @returns {Promise<any>} the public account data stored in the blockchain
	 */
	getAccount(accountNameOrId) {
		if (!isAccountIdOrName(accountNameOrId)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'get_account', [string.toRaw(accountNameOrId)]]);
	}

	/**
	 * Lookup the id of a named account.
	 * @param {string} accountName the name of the account to look up
	 * @returns {Promise<string>} the id of the named account
	 */
	getAccountId(accountName) {
		if (!isAccountName(accountName)) return Promise.reject(new Error('Account name should be string and valid'));
		return this.wsRpc.call([0, 'get_account_id', [string.toRaw(accountName)]]);
	}

	/**
	 * Returns the most recent operations on the named account.
	 * This returns a list of operation history objects, which describe activity on the account.
	 * @param {string} accountIdOrName the name or id of the account
	 * @param {number} limit the number of entries to return (starting from the most recent)
	 * @returns {Promise<any[]>} a list of operation history objects
	 */
	getAccountHistory(accountIdOrName, limit = API_CONFIG.ACCOUNT_HISTORY_DEFAULT_LIMIT) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!limit > API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT) {
			return Promise.reject(new Error(`Limit should be capped at ${API_CONFIG.ACCOUNT_HISTORY_MAX_LIMIT}`));
		}
		return this.wsRpc.call([0, 'get_account_history', [string.toRaw(accountIdOrName),	int64.toRaw(limit)]]);
	}

	/**
	 * Returns the relative operations on the named account from start number.
	 * @param {string} accountIdOrName the name or id of the account
	 * @param {number} stop sequence number of earliest operation
	 * @param {number} limit the number of entries to return (max 100)
	 * @param {number} start the sequence number where to start looping back throw the history
	 * @returns {Promise<any[]>} a list of operation history objects
	 */
	async getRelativeAccountHistory(
		accountIdOrName,
		stop = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_STOP,
		limit = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_DEFAULT_LIMIT,
		start = API_CONFIG.RELATIVE_ACCOUNT_HISTORY_START,
	) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!limit > API_CONFIG.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT) {
			return Promise.reject(new Error(`Limit should be less ${API_CONFIG.RELATIVE_ACCOUNT_HISTORY_MAX_LIMIT}`));
		}
		return this.wsRpc.call([0, 'get_relative_account_history', [
			string.toRaw(accountIdOrName),
			uint64.toRaw(stop),
			int64.toRaw(limit),	uint64.toRaw(start),
		]]);
	}

	/**
	 * Get the contract object from the database by it's id.
	 * @param {string} idOfContract the id of the contract
	 * @returns {Promise<any>} the contract object
	 */
	getContractObject(idOfContract) {
		return this.wsRpc.call([0, 'get_contract_object', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * Get the contract information by the contract's id.
	 * @param {string} idOfContract id of the contract
	 * @returns {Promise<any>} the contract information
	 */
	getContract(idOfContract) { return this.wsRpc.call([0, 'get_contract', [contractId.toRaw(idOfContract)]]); }

	/**
	 * Whitelist or blacklist contract pool.
	 * @param {string} accountIdOrName is an owner of contract which perform whitelisting or blacklisting
	 * @param {string} idOfContract whitelisting or blacklisting applying for this contract
	 * @param {string} addToWhitelist leave it empty if you don't want to add some account to whitelist
	 * @param {string} addToBlacklist leave it empty if you don't want to add some account to blacklist
	 * @param {string} removeFromWhitelist leave it empty if you don't want to remove some account
	 * from whitelist
	 * @param {string} removeFromBlacklist leave it empty if you don't want to remove some account
	 * from blacklist
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the contract whitelist operation
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
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'whitelist_contract_pool', [
			string.toRaw(accountIdOrName),
			contractId.toRaw(idOfContract),
			vector(accountId).toRaw(addToWhitelist),
			vector(accountId).toRaw(addToBlacklist),
			vector(accountId).toRaw(removeFromWhitelist),
			vector(accountId).toRaw(removeFromBlacklist),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Call a contract. Same as `callContract` method but doesn't change the state.
	 * @param {string} idOfContract the id of the contract to call
	 * @param {string} caller contract id or account name or id calling the contract
	 * @param {typeof assetSerializer["__TInput__"]} asset the asset transferred to the contract
	 * @param {string} codeOfTheContract the hash of the method to call
	 * @returns {Promise<string>}
	 */
	callContractNoChangingState(idOfContract, caller, asset, codeOfTheContract) {
		if (!isAccountIdOrName(caller)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isContractCode(codeOfTheContract)) {
			return Promise.reject(new Error('Byte code should be string and valid'));
		}
		return this.wsRpc.call([0, 'call_contract_no_changing_state', [
			contractId.toRaw(idOfContract),
			string.toRaw(caller),
			assetSerializer.toRaw(asset),
			string.toRaw(codeOfTheContract),
		]]);
	}

	/**
	 * Get contract's feepool balance.
	 * @param {string} idOfContract id for getting feepool balance
	 * @returns {Promise<Asset>} contract's feepool balance
	 */
	getContractPoolBalance(idOfContract) {
		return this.wsRpc.call([0, 'get_contract_pool_balance', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * Get contract's whitelist and blacklist.
	 * @param {string} idOfContract id for getting whitelist and blacklist of feepool object
	 * @returns {Promise<any>} whitelist and blacklist of contract pool object
	 */
	getContractPoolWhitelist(idOfContract) {
		return this.wsRpc.call([0, 'get_contract_pool_whitelist', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * Returns information about generated eth address, if then exist and approved, for the given account id.
	 * @param {string} idOfAccount the id of the account to provide information about
	 * @returns {Promise<string | undefined>} the public eth address data stored in the blockchain
	 */
	getEthAddress(idOfAccount) { return this.wsRpc.call([0, 'get_eth_address', [accountId.toRaw(idOfAccount)]]); }

	/**
	 * Returns all approved deposits, for the given account id.
	 * @param {string} idOfAccount the id of the account to provide information about
	 * @returns {Promise<any[]>} the all public deposits data stored in the blockchain
	 */
	getAccountDeposits(idOfAccount) {
		return this.wsRpc.call([0, 'get_account_deposits', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * Creates a transaction to register `erc20_token` for sidechain.
	 * @param {string} accountIdOrName the account who create erc20 token and become his owner
	 * @param {string} ethereumTokenAddress the address of token erc20 token in ethereum network
	 * @param {string} tokenName name of the token in echo network
	 * @param {string} tokenSymbol symbol of the token in echo network
	 * @param {number} decimals number of the digits after the comma of the token in echo network
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the transaction
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
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isNotEmptyString(tokenName)) return Promise.reject(new Error('Name should be string and valid'));
		if (!isNotEmptyString(tokenSymbol)) return Promise.reject(new Error('Name should be string and valid'));
		return this.wsRpc.call([0, 'register_erc20_token', [
			string.toRaw(accountIdOrName),
			ethAddress.toRaw(ethereumTokenAddress),
			string.toRaw(tokenName),
			string.toRaw(tokenSymbol),
			uint8.toRaw(decimals),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Returns information about erc20 token, if then exist.
	 * @param {string} ethereumTokenAddress the ethereum address of token in Ethereum network
	 * @returns {Promise<any | undefined>} the public erc20 token data stored in the blockchain
	 */
	getErc20Token(ethereumTokenAddress) {
		return this.wsRpc.call([0, 'get_erc20_token', [ethAddress.toRaw(ethereumTokenAddress)]]);
	}

	/**
	 * Check on exist erc20 token.
	 * @param {string} idOfContract ID of the contract to get erc20 token
	 * @returns {Promise<boolean>} true if erc20 token data stored in the blockchain, else false
	 */
	checkErc20Token(idOfContract) {
		return this.wsRpc.call([0, 'check_erc20_token', [contractId.toRaw(idOfContract)]]);
	}

	/**
	 * Returns all approved deposits, for the given account id.
	 * @param {string} idOfAccount the id of the account to provide information about
	 * @returns {Promise<any[]>} the all public erc20 deposits data stored in the blockchain
	 */
	getErc20AccountDeposits(idOfAccount) {
		return this.wsRpc.call([0, 'get_erc20_account_deposits', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * Returns all approved withdrawals, for the given account id.
	 * @param {string} idOfAccount the id of the account to provide information about
	 * @returns {Promise<any[]>} the all public erc20 withdrawals data stored in the blockchain
	 */
	getErc20AccountWithdrawals(idOfAccount) {
		return this.wsRpc.call([0, 'get_erc20_account_withdrawals', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * Creates a transaction to withdraw `erc20_token`.
	 * @param {string} accountIdOrName the account who withdraw erc20 token
	 * @param {string} toEthereumAddress the Ethereum address where withdraw erc20 token
	 * @param {string} idOferc20Token the erc20 token id in ECHO
	 * @param {typeof uint256['__TInput__']} withdrawAmount the amount withdraw
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the transaction
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	withdrawErc20Token(accountIdOrName, toEthereumAddress, idOferc20Token, withdrawAmount, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'withdraw_erc20_token', [
			string.toRaw(accountIdOrName),
			ethAddress.toRaw(toEthereumAddress),
			erc20TokenId.toRaw(idOferc20Token),
			uint256.toRaw(withdrawAmount),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Generate address of specified account
	 * @param {string} accountIdOrName ID or name of the account
	 * @param {string} label label for new account address
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the transaction
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	generateAccountAddress(accountIdOrName, label, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isNotEmptyString(label)) return Promise.reject(new Error('Label should be string and valid'));
		return this.wsRpc.call([0, 'generate_account_address', [
			string.toRaw(accountIdOrName),
			string.toRaw(label),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Get addresses of specified account
	 * @param {string} idOfAccount ID of the account
	 * @param {number} startFrom number of block to start retrieve from
	 * @param {number} limit maximum number of addresses to return
	 * @returns {Promise<any[]>} Addresses owned by account in specified ids interval
	 */
	getAccountAddresses(idOfAccount, startFrom, limit) {
		return this.wsRpc.call([0, 'get_account_addresses', [
			accountId.toRaw(idOfAccount),
			uint64.toRaw(startFrom),
			uint64.toRaw(limit),
		]]);
	}

	/**
	 * Get owner of specified address.
	 * @param {string} address address in form of ripemd160 hash
	 * @returns {Promise<string | undefined>} Account id of owner
	 */
	getAccountByAddress(address) { return this.wsRpc.call([0, 'get_account_by_address', [ripemd160.toRaw(address)]]); }

	/**
	 * Returns all approved withdrawals, for the given account id.
	 * @param {string} idOfAccount the id of the account to provide information about
	 * @returns {Promise<any[]>} the all public withdrawals data stored in the blockchain
	 */
	getAccountWithdrawals(idOfAccount) {
		return this.wsRpc.call([0, 'get_account_withdrawals', [accountId.toRaw(idOfAccount)]]);
	}

	/**
	 * Approve or disapprove a proposal.
	 * @param {string} feePayingAccountId the account paying the fee for the op
	 * @param {string} idOfProposal the proposal to modify
	 * @param {any} delta[members contain approvals to create or remove.
	 * In JSON you can leave empty members undefined]
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the transaction
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	approveProposal(feePayingAccountId, idOfProposal, delta, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'approve_proposal', [
			accountId.toRaw(feePayingAccountId),
			proposalId.toRaw(idOfProposal),
			wallet.approvalDelta.toRaw(delta),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Generate ethereum address.
	 * @param {string} accountIdOrName the name or id of the account
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the transaction
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	generateEthAddress(accountIdOrName, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'generate_eth_address', [
			string.toRaw(accountIdOrName),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Withdraw ethereum.
	 * @param {string} accountIdOrName the name or id of the account
	 * @param {string} ethOfAddress the address of token erc20 token in ethereum network
	 * @param {number} value amount for withdraw
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the transaction
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	withdrawEth(accountIdOrName, ethOfAddress, value, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'withdraw_eth', [
			string.toRaw(accountIdOrName),
			ethAddress.toRaw(ethOfAddress),
			uint64.toRaw(value),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Flood the network.
	 * @param {string} prefix prefix
	 * @param {string} numberOfTransactions number of transactions to flood
	 * @returns {Promise<void>}
	 */
	floodNetwork(prefix, numberOfTransactions) {
		return this.wsRpc.call([0, 'flood_network', [
			string.toRaw(prefix),
			uint32.toRaw(numberOfTransactions),
		]]);
	}

	/**
	 * Lists all assets registered on the blockchain.
	 * To list all assets, pass the empty string `` for the lowerbound to start
	 * at the beginning of the list, and iterate as necessary.
	 * @param {string} lowerBoundSymbol the symbol of the first asset to include in the list
	 * @param {number} limit the maximum number of assets to return (max: 100)
	 * @return {Promise<Asset[]>} the list of asset objects, ordered by symbol
	 */
	listAssets(lowerBoundSymbol, limit = API_CONFIG.LIST_ASSETS_DEFAULT_LIMIT) {
		if (!limit > API_CONFIG.LIST_ASSETS_MAX_LIMIT) {
			return Promise.reject(new Error(`Limit should be capped at ${API_CONFIG.LIST_ASSETS_MAX_LIMIT}`));
		}
		return this.wsRpc.call([0, 'list_assets', [assetId.toRaw(lowerBoundSymbol), uint32.toRaw(limit)]]);
	}

	/**
	 * Creates a new user-issued or market-issued asset. Many options can be changed later using `update_asset()`.
	 * Right now this function is difficult to use because you must provide raw JSON data
	 * structures for the options objects, and those include prices and asset ids.
	 * @param {string} accountIdOrName the name or id of the account who will pay the fee and become the
	 * issuer of the new asset. This can be updated later
	 * @param {string} symbol the ticker symbol of the new asset
	 * @param {number} precision the number of digits of precision to the right of the decimal point,
	 * must be less than or equal to 12
	 * @param {any} assetOption asset options required for all new assets.
	 * Note that `core_exchange_rate` technically needs to store the asset ID of this new asset.
	 * Since this ID is not known at the time this operation is created, create this price as though the new asset has
	 * instance ID 1, and the chain will overwrite it with the new asset's ID.
	 * @param {any} bitassetOpts options specific to BitAssets.
	 * This may be null unless the `market_issued` flag is set in common.flags
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction creating a new asset
	 */
	createAsset(accountIdOrName, symbol, precision, assetOption, bitassetOpts, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isAssetName(symbol)) return Promise.reject(new Error('Assets symbol should be string and valid'));
		return this.wsRpc.call([0, 'create_asset', [
			string.toRaw(accountIdOrName),
			string.toRaw(symbol),
			uint8.toRaw(precision),
			options.toRaw(assetOption),
			optional(bitassetOptions).toRaw(bitassetOpts),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Update the core options on an asset.
	 * There are a number of options which all assets in the network use.
	 * This command is used to update these options for an existing asset.
	 * This operation cannot be used to update BitAsset-specific options.
	 * For these options, `updateBitasset` instead.
	 * @param {string} assetIdOrName the name or id of the asset to update
	 * @param {string} newIssuerIdOrName if changing the asset's issuer, the name or id of the new issuer.
	 * null if you wish to remain the issuer of the asset
	 * @param {any} newOptions the new asset_options object, which will entirely replace the existing
	 * options
	 * @param {boolean} shouldDoBroadcastToNetwork broadcast true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction updating the asset
	 */
	updateAsset(assetIdOrName, newIssuerIdOrName, newOptions, shouldDoBroadcastToNetwork) {
		if (!isAssetIdOrName(assetIdOrName)) {
			return Promise.reject(new Error('Assets id or name should be string and valid'));
		}
		if (!isAccountIdOrName(newIssuerIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'update_asset', [
			string.toRaw(assetIdOrName),
			string.toRaw(newIssuerIdOrName),
			options.toRaw(newOptions),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Update the options specific to a BitAsset.
	 * BitAssets have some options which are not relevant to other asset types.
	 * This operation is used to update those options an existing BitAsset
	 * @see {@link WalletAPI['updateAsset']}
	 * @param {string} assetIdOrName the name or id of the asset to update, which must be a market-issued asset
	 * @param {any} newBitasset the new bitasset_options object, which will entirely replace the existing options
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction updating the bitasset
	 */
	updateBitasset(assetIdOrName, newBitasset, shouldDoBroadcastToNetwork) {
		if (!isAssetIdOrName(assetIdOrName)) {
			return Promise.reject(new Error('Assets id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'update_bitasset', [
			string.toRaw(assetIdOrName),
			bitassetOptions.toRaw(newBitasset),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Update the set of feed-producing accounts for a BitAsset.
	 * BitAssets have price feeds selected by taking the median values of recommendations from a set of feed producers.
	 * This command is used to specify which accounts may produce feeds for a given BitAsset.
	 * @param {string} assetIdOrName the name or id of the asset to update
	 * @param {string[]} newFeedProducers a list of account names or ids which are authorized to produce feeds
	 * for the asset. This list will completely replace the existing list
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction updating the bitasset's feed producers
	 */
	updateAssetFeedProducers(assetIdOrName, newFeedProducers, shouldDoBroadcastToNetwork) {
		if (!isAssetIdOrName(assetIdOrName)) {
			return Promise.reject(new Error('Assets id or name should be string and valid'));
		}
		if (!newFeedProducers.every((idOrName) => !!isAccountIdOrName(idOrName))) {
			return Promise.reject(new Error('Accounts should contain valid account names or ids'));
		}
		return this.wsRpc.call([0, 'update_asset_feed_producers', [
			string.toRaw(assetIdOrName),
			vector(string).toRaw(newFeedProducers),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Publishes a price feed for the named asset.
	 * Price feed providers use this command to publish their price feeds for market-issued assets. A price feed is
	 * used to tune the market for a particular market-issued asset. For each value in the feed,
	 * the median across all `committee_member` feeds for that asset is calculated and the market
	 * for the asset is configured with the median of that value.
	 *
	 * The feed object in this command contains three prices: a call price limit, a short price limit,
	 * and a settlement price. The call limit price is structured as (collateral asset) / (debt asset)
	 * and the short limit price is structured as (asset for sale) / (collateral asset).
	 * Note that the asset IDs are opposite to each other, so if we're publishing a feed for USD,
	 * the call limit price will be ECHO/USD and the short limit price will be USD/ECHO. The settlement price may be
	 * flipped either direction, as long as it is a ratio between the market-issued asset and its collateral.
	 *
	 * @param {string} accountIdOrName the account publishing the price feed
	 * @param {string} assetIdOrName the name or id of the asset whose feed we're publishing
	 * @param {any} priceOfFeed object containing the three prices making up the feed
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction updating the price feed for the given asset
	 */
	publishAssetFeed(accountIdOrName, assetIdOrName, priceOfFeed, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isAssetIdOrName(assetIdOrName)) {
			return Promise.reject(new Error('Assets id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'publish_asset_feed', [
			string.toRaw(accountIdOrName),
			string.toRaw(assetIdOrName),
			priceFeed.toRaw(priceOfFeed),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Issue new shares of an asset.
	 * @param {string} accountIdOrName the name or id of the account to receive the new shares
	 * @param {string} amount the amount to issue, in nominal units
	 * @param {string} assetTicker the ticker symbol of the asset to issue
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction issuing the new shares
	 */
	issueAsset(accountIdOrName, amount, assetTicker, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isValidAmount(amount)) return Promise.reject(new Error('Invalid number'));
		return this.wsRpc.call([0, 'issue_asset', [
			string.toRaw(accountIdOrName),
			string.toRaw(amount),
			string.toRaw(assetTicker),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Returns information about the given asset.
	 * @param {string} assetIdOrName the symbol or id of the asset in question
	 * @returns {Promise<any>} the information about the asset stored in the block chain
	 */
	getAsset(assetIdOrName) {
		if (!isAssetIdOrName(assetIdOrName)) {
			return Promise.reject(new Error('Assets id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'get_asset', [string.toRaw(assetIdOrName)]]);
	}

	/**
	 * Returns the BitAsset-specific data for a given asset.
	 * Market-issued assets's behavior are determined both by their "BitAsset Data" and
	 * their basic asset data, as returned by `get_asset()`.
	 * @param {string} bitassetIdOrName the symbol or id of the BitAsset in question
	 * @returns {Promise<any>} the BitAsset-specific data for this asset
	 */
	getBitassetData(bitassetIdOrName) {
		if (!isAssetIdOrName(bitassetIdOrName)) {
			return Promise.reject(new Error('Assets id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'get_bitasset_data', [string.toRaw(bitassetIdOrName)]]);
	}

	/**
	 * Pay into the fee pool for the given asset.
	 * User-issued assets can optionally have a pool of the core asset which is automatically used to pay transaction
	 * fees for any transaction using that asset (using the asset's core exchange rate).
	 * This command allows anyone to deposit the core asset into this fee pool.
	 * @param {string} fromAccountIdOrName the name or id of the account sending the core asset
	 * @param {string} assetIdOrName the name or id of the asset whose fee pool you wish to fund
	 * @param {string} amount the amount of the core asset to deposit
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction funding the fee pool
	 */
	fundAssetFeePool(fromAccountIdOrName, assetIdOrName, amount, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(fromAccountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isAssetIdOrName(assetIdOrName)) {
			return Promise.reject(new Error('Assets id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'fund_asset_fee_pool', [
			string.toRaw(fromAccountIdOrName),
			string.toRaw(assetIdOrName),
			string.toRaw(amount),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Burns the given user-issued asset.
	 * This command burns the user-issued asset to reduce the amount in circulation.

	 * You cannot burn market-issued assets.

	 * @param {string} accountIdOrName the account containing the asset you wish to burn
	 * @param {string} amount the amount to burn, in nominal units
	 * @param {string} assetIdOrName the name or id of the asset to burn
	 * @param {boolean} shouldDoBroadcastToNetwork true to broadcast the transaction on the network
	 * @returns {Promise<SignedTransaction>} the signed transaction burning the asset
	 */
	reserveAsset(accountIdOrName, amount, assetIdOrName, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		if (!isValidAmount(amount)) return Promise.reject(new Error('Invalid number'));
		if (!isAssetIdOrName(assetIdOrName)) {
			return Promise.reject(new Error('Assets id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'reserve_asset', [
			string.toRaw(accountIdOrName),
			string.toRaw(amount),
			string.toRaw(assetIdOrName),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Returns information about the given committee member.
	 * @param {string} accountIdOrName the name or id of the committee member account owner,
	 * or the id of the committee member
	 * @returns {Promise<any>} the information about the committee member stored in the block chain
	 */
	getCommitteeMember(accountIdOrName) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'get_committee_member', [string.toRaw(accountIdOrName)]]);
	}

	/**
	 * Lists all committee_members registered in the blockchain.
	 * This returns a list of all account names that own committee_members, and the associated committee member id,
	 * sorted by name. This lists committee_members whether they are currently voted in or not.
	 * Use the `lowerbound` and limit parameters to page through the list. To retrieve all committee members,
	 * start by setting `lowerbound` to the empty string `""`, and then each iteration, pass
	 * the last committee member name returned as the `lowerbound` for the next `listCommitteeMembers` call.
	 * @param {string} lowerBoundName the name of the first `committee_member` to return.
	 * If the named `committee_member` does not exist, the list will start at the `committee_member`
	 * that comes after `lowerbound`
	 * @param {number} limit limit the maximum number of committee_members to return (max: 1000)
	 * @returns {Promise<[string, string][]>} a list of committee_members mapping committee member names
	 * to committee members' id
	 */
	listCommitteeMembers(lowerBoundName, limit = API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_DEFAULT_LIMIT) {
		if (!limit > API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT) {
			return Promise.reject(new Error(`Limit should be less ${API_CONFIG.COMMITTEE_MEMBER_ACCOUNTS_MAX_LIMIT}`));
		}
		return this.wsRpc.call([0, 'list_committee_members', [string.toRaw(lowerBoundName), uint64.toRaw(limit)]]);
	}

	/**
	 * Creates a transaction to propose a parameter change.
	 * Multiple parameters can be specified if an atomic change is desired.
	 * @param {string} accountIdOrName the account paying the fee to propose the tx
	 * @param {number} expirationTime timestamp specifying when the proposal will either take effect or expire
	 * @param {any} changeValues the values to change; all other chain parameters are filled in with default values
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the transaction
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	proposeParameterChange(accountIdOrName, expirationTime, changeValues, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'propose_parameter_change', [
			string.toRaw(accountIdOrName),
			timePointSec.toRaw(expirationTime),
			variantObject.toRaw(changeValues),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Propose a fee change.
	 * @param {string} accountIdOrName the account paying the fee to propose the tx
	 * @param {number} expirationTime timestamp specifying when the proposal will either take effect or expire
	 * @param {any} changedValues [map of operation type to new fee. Operations may be specified by name or ID.
	 * The "scale" key changes the scale. All other operations will maintain current values]
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the transaction
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	proposeFeeChange(accountIdOrName, expirationTime, changedValues, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'propose_fee_change', [
			string.toRaw(accountIdOrName),
			timePointSec.toRaw(expirationTime),
			variantObject.toRaw(changedValues),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Change sidechain config.
	 * @param {string} accountIdOrName the account id who changing side chain config
	 * @param {any} changedValues the values to change
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the transaction
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	changeSidechainConfig(accountIdOrName, changedValues, shouldDoBroadcastToNetwork) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'change_sidechain_config', [
			string.toRaw(accountIdOrName),
			config.toRaw(changedValues),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Returns info about a specified block.
	 * @param {number} blockNum height of the block to retrieve
	 * @return {Promise<any | undefined>} info about the block, or undefined if not found
	 */
	getBlock(blockNum) { return this.wsRpc.call([0, 'get_block', [uint32.toRaw(blockNum)]]); }

	/**
	 * Returns block virtual ops by number
	 * @param {number} blockNum height of the block to retrieve
	 * @return {Promise<any[]>} info about operation history object
	 */
	getBlockVirtualOps(blockNum) { return this.wsRpc.call([0, 'get_block_virtual_ops', [uint32.toRaw(blockNum)]]); }

	/**
	 * Returns the number of accounts registered on the blockchain.
	 * @return {Promise<number | string>} the number of registered accounts
	 */
	getAccountCount() { return this.wsRpc.call([0, 'get_account_count', []]); }

	/**
	 * Returns the block chain's slowly-changing settings.
	 * This object contains all of the properties of the blockchain that are fixed or that change only once
	 * per maintenance interval (daily) such as the current list of committee_members, block interval, etc.
	 * @see {@link WalletAPI['getDynamicGlobalProperties']} for frequently changing properties
	 * @return {Promise<any>} the global properties
	 */
	getGlobalProperties() { return this.wsRpc.call([0, 'get_global_properties', []]); }

	/**
	 * Returns the block chain's rapidly-changing properties.
	 * The returned object contains information that changes every block interval
	 * such as the head block number, etc.
	 * @see {@link WalletAPI['getGlobalProperties']} for less-frequently changing properties
	 * @return {Promise<any>} the dynamic global properties
	 */
	getDynamicGlobalProperties() { return this.wsRpc.call([0, 'get_dynamic_global_properties', []]); }

	/**
	 * Returns the blockchain object corresponding to the given id.
	 * This generic function can be used to retrieve any object from the blockchain that is assigned an ID.
	 * @param {string} objectId the id of the object to return
	 * @returns {Promise<any>} the requested object
	 */
	getObject(objectId) { return this.wsRpc.call([0, 'get_object', [anyObjectId.toRaw(objectId)]]); }

	/**
	 * Create a new transaction builder.
	 * @returns {Promise<number>} handle of the new transaction builder
	 */
	beginBuilderTransaction() { return this.wsRpc.call([0, 'begin_builder_transaction', []]); }

	/**
	 * Append a new operation to a transaction builder.
	 * @param {number} transactionTypeHandle handle of the transaction builder
	 * @param {string[]} newOperation the operation in JSON format
	 * @returns {Promise<void>}
	 */
	addOperationToBuilderTransaction(transactionTypeHandle, newOperation) {
		return this.wsRpc.call([0, 'add_operation_to_builder_transaction', [
			uint16.toRaw(transactionTypeHandle),
			operation.toRaw(newOperation),
		]]);
	}

	/**
	 * Replace an operation in a transaction builder with a new operation.
	 * @param {number} transactionTypeHandle handle of the transaction builder
	 * @param {number} unsignedOperation the index of the old operation in the builder to be replaced
	 * @param {string[]} newOperation the new operation in JSON format
	 * @returns {Promise<void>}
	 */
	replaceOperationInBuilderTransaction(transactionTypeHandle, unsignedOperation, newOperation) {
		return this.wsRpc.call([0, 'replace_operation_in_builder_transaction', [
			uint16.toRaw(transactionTypeHandle),
			uint64.toRaw(unsignedOperation),
			operation.toRaw(newOperation),
		]]);
	}

	/**
	 * Calculate and update fees for the operations in a transaction builder.
	 * @param {number} transactionTypeHandle handle of the transaction builder
	 * @param {string} feeAsset name or ID of an asset that to be used to pay fees
	 * @returns {Promise<Asset>} total fees
	 */
	setFeesOnBuilderTransaction(transactionTypeHandle, feeAsset) {
		if (!isAssetIdOrName(feeAsset)) {
			return Promise.reject(new Error('Assets id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'set_fees_on_builder_transaction', [
			uint16.toRaw(transactionTypeHandle),
			string.toRaw(feeAsset),
		]]);
	}

	/**
	 * Show content of a transaction builder.
	 * @param {number} transactionTypeHandle handle of the transaction builder
	 * @returns {Promise<any>} a transaction
	 */
	previewBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'preview_builder_transaction', [uint64.toRaw(transactionTypeHandle)]]);
	}

	/**
	 * Sign the transaction in a transaction builder and optionally broadcast to the network.
	 * @param {number} transactionTypeHandle handle of the transaction builder
	 * @param {boolean} shouldDoBroadcastToNetwork whether to broadcast the signed transaction to the network
	 * @returns {Promise<SignedTransaction>} a signed transaction
	 */
	signBuilderTransaction(transactionTypeHandle, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'sign_builder_transaction', [
			uint16.toRaw(transactionTypeHandle),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Create a proposal containing the operations in a transaction builder (create a new `PROPOSAL_CREATE` operation,
	 * then replace the transaction builder with the new operation), then sign the transaction and optionally broadcast
	 * to the network.
	 * @param {number} transactionTypeHandle handle of the transaction builder
	 * @param {string} expirationTime when the proposal will expire
	 * @param {number} reviewPeriod review period of the proposal in seconds
	 * @param {boolean} shouldDoBroadcastToNetwork whether to broadcast the signed transaction to the network
	 * @returns {Promise<SignedTransaction>} a signed transaction
	 */
	proposeBuilderTransaction(transactionTypeHandle, expirationTime, reviewPeriod, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'propose_builder_transaction', [
			uint16.toRaw(transactionTypeHandle),
			timePointSec.toRaw(expirationTime),
			uint32.toRaw(reviewPeriod),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Create a proposal containing the operations in a transaction builder (create a new `PROPOSAL_CREATE` operation,
	 * then replace the transaction builder with the new operation),
	 * then sign the transaction and optionally broadcast to the network.
	 * @param {number} transactionTypeHandle handle of the transaction builder
	 * @param {string} accountIdOrName name or ID of the account who would pay fees for creating the proposal
	 * @param {string} expirationTime when the proposal will expire
	 * @param {number} reviewPeriod review period of the proposal in seconds
	 * @param {boolean} shouldDoBroadcastToNetwork whether to broadcast the signed transaction to the network
	 * @returns {Promise<any>} a signed transaction
	 */
	proposeBuilderTransaction2(
		transactionTypeHandle,
		accountIdOrName,
		expirationTime,
		reviewPeriod,
		shouldDoBroadcastToNetwork,
	) {
		if (!isAccountIdOrName(accountIdOrName)) {
			return Promise.reject(new Error('Accounts id or name should be string and valid'));
		}
		return this.wsRpc.call([0, 'propose_builder_transaction2', [
			uint16.toRaw(transactionTypeHandle),
			string.toRaw(accountIdOrName),
			timePointSec.toRaw(expirationTime),
			uint32.toRaw(reviewPeriod),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Destroy a transaction builder.
	 * @param {number} transactionTypeHandle handle of the transaction builder
	 * @returns {Promise<void>}
	 */
	removeBuilderTransaction(transactionTypeHandle) {
		return this.wsRpc.call([0, 'remove_builder_transaction', [uint16.toRaw(transactionTypeHandle)]]);
	}

	/**
	 * Converts a signed_transaction in JSON form to its binary representation.
	 * @param {any} tr the transaction to serialize
	 * @returns {Promise<String>} the binary form of the transaction. It will not be hex encoded,
	 * this returns a raw string that may have null characters embedded in it
	 */
	serializeTransaction(tr) { return this.wsRpc.call([0, 'serialize_transaction', [signedTransaction.toRaw(tr)]]); }

	/**
	 * Signs a transaction.
	 * Given a fully-formed transaction that is only lacking signatures, this signs
	 * the transaction with the necessary keys and optionally broadcasts the transaction.
	 * @param {any} tr the unsigned transaction
	 * @param {boolean} shouldDoBroadcastToNetwork true if you wish to broadcast the transaction
	 * @returns {Promise<SignedTransaction>} the signed version of the transaction
	 */
	signTransaction(tr, shouldDoBroadcastToNetwork) {
		return this.wsRpc.call([0, 'sign_transaction', [
			transaction.toRaw(tr),
			bool.toRaw(shouldDoBroadcastToNetwork),
		]]);
	}

	/**
	 * Returns an uninitialized object representing a given blockchain operation.
	 * This returns a default-initialized object of the given type; it can be used during early development of the
	 * wallet when we don't yet have custom commands for creating all of the operations the blockchain supports.
	 * Any operation the blockchain supports can be created using the transaction builder's
	 * `addOperationToBuilderTransaction`, but to do that from the CLI you need to know what the JSON form of the
	 * operation looks like. This will give you a template you can fill in. It's better than nothing.
	 * @param {string} operationType the type of operation to return
	 * @returns {Promise<Operation>} a default-constructed operation of the given type
	 */
	getPrototypeOperation(operationType) {
		if (!isOperationPrototypeExists(operationType)) {
			return Promise.reject(new Error('This operation does not exists'));
		}
		return this.wsRpc.call([0, 'get_prototype_operation', [string.toRaw(operationType)]]);
	}

	/*
	 * @method generateBtcDepositAddress
	 * @param {String} accountNameOrId
	 * @param {String} backupAddress
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	generateBtcDepositAddress(accountIdOrName, backupAddress, shouldDoBroadcastToNetwork) {
		if (!(isAccountId(accountIdOrName) || isAccountName(accountIdOrName))) {
			throw new Error('accounts id or name should be string and valid');
		}

		if (!isBoolean(shouldDoBroadcastToNetwork)) return Promise.reject(new Error('broadcast should be a boolean'));

		return this.wsRpc.call([0, 'generate_btc_deposit_address',
			[accountIdOrName, backupAddress, shouldDoBroadcastToNetwork],
		]);
	}

	/**
	 * @method getBtcAddresses
	 * @param {String} accountId
	 * @returns {Promise<Array>}
	 */
	getBtcAddresses(accountIdValue) {
		if (!isAccountId(accountIdValue)) throw new Error('account should be valid');

		return this.wsRpc.call([0, 'get_btc_addresses', [accountIdValue]]);
	}

	/**
	 * @method getBtcDepositScript
	 * @param {String} btcDepositAddress
	 * @returns {Promise<String>}
	 */
	getBtcDepositScript(btcDepositAddress) {
		return this.wsRpc.call([0, 'get_btc_deposit_script', [btcDepositAddress]]);
	}

	/**
	 * @method withdrawBtc
	 * @param {String} accountIdOrName
	 * @param {String} addressToWithdraw
	 * @param {Number} amount
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	withdrawBtc(accountIdOrName, addressToWithdraw, amount, shouldDoBroadcastToNetwork) {
		if (!(isAccountId(accountIdOrName) || isAccountName(accountIdOrName))) {
			throw new Error('accounts id or name should be string and valid');
		}

		if (!isUInt64(amount)) return Promise.reject(new Error('amount should be a non negative integer'));
		if (!isBoolean(shouldDoBroadcastToNetwork)) return Promise.reject(new Error('broadcast should be a boolean'));

		return this.wsRpc.call([0, 'withdraw_btc',
			[accountIdOrName, addressToWithdraw, amount, shouldDoBroadcastToNetwork],
		]);
	}

	/*
	 * @method registerAccountWithApi
	 * @param {String} name
	 * @param {String} activeKey
	 * @param {String} echorandKey
	 * @returns {Promise<void>}
	 */
	registerAccountWithApi(name, activeKey, echorandKey) {
		if (!isAccountName(name)) return Promise.reject(new Error('new account name is invalid'));
		if (!isPublicKey(activeKey)) return Promise.reject(new Error('active key is invalid'));
		if (!isPublicKey(echorandKey)) return Promise.reject(new Error('echorand key is invalid'));

		return this.wsRpc.call([0, 'register_account_with_api', [name, activeKey, echorandKey]]);
	}

	/**
	 * @method listFrozenBalances
	 * @param {String} accountNameOrId
	 * @returns {Promise<Array>}
	 */
	listFrozenBalances(accountNameOrId) {
		if (!(isAccountName(accountNameOrId) || isAccountId(accountNameOrId))) {
			return Promise.reject(new Error('Account name or id is invalid'));
		}

		return this.wsRpc.call([0, 'list_frozen_balances', [accountNameOrId]]);
	}

	/**
	 * @method transfer
	 * @param {String} fromAccountNameOrId
	 * @param {Number} amount
	 * @param {String} assetIdOrName
	 * @param {number} duration
	 * @param {Boolean} shouldDoBroadcastToNetwork
	 * @returns {Promise<SignedTransaction>}
	 */
	freezeBalance(fromAccountNameOrId, amount, assetIdOrName, duration, shouldDoBroadcastToNetwork) {
		if (!isAccountId(fromAccountNameOrId) || isAccountName(fromAccountNameOrId)) {
			return Promise.reject(new Error('Account name or id is invalid'));
		}

		if (!isUInt64(amount)) return Promise.reject(new Error('amount should be a non negative integer'));

		if (!isAssetId(assetIdOrName) || isAssetName(assetIdOrName)) {
			return Promise.reject(new Error('Account name or id is invalid'));
		}

		if (!isUInt64(duration)) return Promise.reject(new Error('duration should be a non negative integer'));
		if (!isBoolean(shouldDoBroadcastToNetwork)) return Promise.reject(new Error('Broadcast should be a boolean'));

		return this.wsRpc.call([0, 'freeze_balance',
			[fromAccountNameOrId, amount, assetIdOrName, duration, shouldDoBroadcastToNetwork],
		]);
	}

	/**
	 * @method getCommitteeFrozenBalance
	 * @param {String} ownerAccount
	 * @returns {Promise<CommitteeFrozenBalance>}
	 */
	getCommitteeFrozenBalance(ownerAccount) {
		if (!isAccountIdOrName(ownerAccount)) {
			return Promise.reject(new Error('Account name or id is invalid'));
		}

		return this.wsRpc.call([0, 'get_committee_frozen_balance', [string.toRaw(ownerAccount)]]);
	}


	/**
	 * @method committeeFreezeBalance
	 * @param {String} ownerAccount
	 * @param {String} amount
	 * @param {Boolean} broadcast
	 * @returns {Promise<SignedTransaction>}
	 */
	committeeFreezeBalance(ownerAccount, amount, broadcast = false) {
		if (!isAccountIdOrName(ownerAccount)) return Promise.reject(new Error('Account name or id is invalid'));
		if (!isValidAmount(amount))	return Promise.reject(new Error('Invalid amount'));

		return this.wsRpc.call([0, 'committee_freeze_balance', [
			string.toRaw(ownerAccount),
			string.toRaw(amount),
			bool.toRaw(broadcast),
		]]);
	}

	/**
	 * @method committeeWithdrawBalance
	 * @param {String} ownerAccount
	 * @param {String} amount
	 * @param {Boolean} broadcast
	 * @returns {Promise<SignedTransaction>}
	 */
	committeeWithdrawBalance(ownerAccount, amount, broadcast = false) {
		if (!isAccountIdOrName(ownerAccount)) return Promise.reject(new Error('Account name or id is invalid'));
		if (!isValidAmount(amount))	return Promise.reject(new Error('Invalid amount'));

		return this.wsRpc.call([0, 'committee_withdraw_balance', [
			string.toRaw(ownerAccount),
			string.toRaw(amount),
			bool.toRaw(broadcast),
		]]);
	}

	/**
	 * @method createActivateCommitteeMemberProposal
	 * @param {String} sender
	 * @param {String} committeeToActivate
	 * @param {Number} expirationTime
	 * @param {Boolean} broadcast
	 * @returns {Promise<SignedTransaction>}
	 */
	createActivateCommitteeMemberProposal(sender, committeeToActivate, expirationTime, broadcast = false) {
		if (!isAccountIdOrName(sender)) return Promise.reject(new Error('Account name or id is invalid'));
		if (!isCommitteeMemberId(committeeToActivate)) return Promise.reject(new Error('Invalid committee member id'));

		return this.wsRpc.call([0, 'create_activate_committee_member_proposal', [
			accountId.toRaw(sender),
			committeeMemberId.toRaw(committeeToActivate),
			timePointSec.toRaw(expirationTime),
			bool.toRaw(broadcast),
		]]);
	}

	/**
	 * @method createDeactivateCommitteeMemberProposal
	 * @param {String} sender
	 * @param {String} committeeTodeactivate
	 * @param {Number} expirationTime
	 * @param {Boolean} broadcast
	 * @returns {Promise<SignedTransaction>}
	 */
	createDeactivateCommitteeMemberProposal(sender, committeeTodeactivate, expirationTime, broadcast = false) {
		if (!isAccountIdOrName(sender)) return Promise.reject(new Error('Account name or id is invalid'));
		if (!isCommitteeMemberId(committeeTodeactivate)) {
			return Promise.reject(new Error('Invalid committee member id'));
		}

		return this.wsRpc.call([0, 'create_deactivate_committee_member_proposal', [
			accountId.toRaw(sender),
			committeeMemberId.toRaw(committeeTodeactivate),
			timePointSec.toRaw(expirationTime),
			bool.toRaw(broadcast),
		]]);
	}

	/**
	 * @method updateCommitteeMember
	 * @param {String} ownerAccount
	 * @param {String} committeeMember
	 * @param {String} newUrl
	 * @param {String} newEthAddress
	 * @param {String} newBtcPublicKey
	 * @param {Boolean} broadcast
	 * @returns {Promise<SignedTransaction>}
	 */
	updateCommitteeMember(ownerAccount, committeeMember, newUrl, newEthAddress, newBtcPublicKey, broadcast = false) {
		if (!isAccountIdOrName(ownerAccount)) return Promise.reject(new Error('Account name or id is invalid'));
		if (!isCommitteeMemberId(committeeMember)) {
			return Promise.reject(new Error('Invalid committee member id'));
		}
		if (newUrl && !validateUrl(newUrl) && newUrl !== '') {
			return Promise.reject(new Error('Url should be string and valid'));
		}

		return this.wsRpc.call([0, 'update_committee_member', [
			accountId.toRaw(ownerAccount),
			committeeMemberId.toRaw(committeeMember),
			string.toRaw(newUrl),
			string.toRaw(newEthAddress),
			string.toRaw(newBtcPublicKey),
			bool.toRaw(broadcast),
		]]);
	}

	/**
	 * @method createCommitteeMember
	 * @param {String} ownerAccount
	 * @param {String} url
	 * @param {String} ethereumAddress
	 * @param {String} btcPublicKey
	 * @param {Boolean} broadcast
	 * @returns {Promise<SignedTransaction>}
	 */
	createCommitteeMember(ownerAccount, url, amount, ethereumAddress, btcPublicKey, broadcast = false) {
		if (!isAccountIdOrName(ownerAccount)) return Promise.reject(new Error('Account name or id is invalid'));
		if (url && !validateUrl(url) && url !== '') {
			return Promise.reject(new Error('Url should be string and valid'));
		}
		if (!isValidAmount(amount)) return Promise.reject(new Error('Invalid number'));

		return this.wsRpc.call([0, 'create_committee_member', [
			accountId.toRaw(ownerAccount),
			string.toRaw(url),
			string.toRaw(amount),
			string.toRaw(ethereumAddress),
			string.toRaw(btcPublicKey),
			bool.toRaw(broadcast),
		]]);
	}

}

export default WalletAPI;
