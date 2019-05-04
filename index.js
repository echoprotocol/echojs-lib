const { Apis } = require('echojs-ws');

/* Serializer */
const Serializer = require('./serializer/src/serializer');
const fp = require('./serializer/src/FastParser');
const types = require('./serializer/src/types');
const ops = require('./serializer/src/operations');
const template = require('./serializer/src/template');
const SerializerValidation = require('./serializer/src/SerializerValidation');

/* ECC */
const Address = require('./ecc/src/address');
const Aes = require('./ecc/src/aes');
const PrivateKey = require('./ecc/src/PrivateKey');
const PublicKey = require('./ecc/src/PublicKey');
const Signature = require('./ecc/src/signature');
const brainKey = require('./ecc/src/BrainKey');
const hash = require('./ecc/src/hash');
const key = require('./ecc/src/KeyUtils');
const ED25519 = require('./ecc/src/ed25519');
const PublicKeyECDSA = require('./ecc/src/ECDSA/PublicKey');

/* Chain */
const ChainStore = require('./chain/src/ChainStore');
const TransactionBuilder = require('./chain/src/TransactionBuilder');
const ChainTypes = require('./chain/src/ChainTypes');
const ObjectId = require('./chain/src/ObjectId');
const NumberUtils = require('./chain/src/NumberUtils');
const TransactionHelper = require('./chain/src/TransactionHelper');
const ChainValidation = require('./chain/src/ChainValidation');
const EmitterInstance = require('./chain/src/EmitterInstance');
const Login = require('./chain/src/AccountLogin');
const ContractFrame = require('./chain/src/ContractFrame');

const { FetchChainObjects, FetchChain } = ChainStore;

module.exports = {
	Apis,
	Serializer,
	fp,
	types,
	ops,
	template,
	SerializerValidation,
	Address,
	Aes,
	PrivateKey,
	PublicKey,
	Signature,
	brainKey,
	hash,
	key,
	ED25519,
	PublicKeyECDSA,
	ChainStore,
	TransactionBuilder,
	FetchChainObjects,
	ChainTypes,
	EmitterInstance,
	ObjectId,
	NumberUtils,
	TransactionHelper,
	ChainValidation,
	FetchChain,
	Login,
	ContractFrame,
};
