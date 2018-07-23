/* eslint-disable camelcase */

const secureRandom = require('secure-random');
const { Long } = require('bytebuffer');
const { Apis } = require('echojs-ws');

const { Signature } = require('../../ecc');
const { ops } = require('../../serializer');


const helper = {};

helper.unique_nonce_entropy = null;
helper.unique_nonce_uint64 = () => {
	const entropy = ((() => {
		if (helper.unique_nonce_entropy === null) {
			//	console.log('... secureRandom.randomUint8Array(1)[0]',secureRandom.randomUint8Array(1)[0])
			return parseInt(secureRandom.randomUint8Array(1)[0], 10);
		}

		return (helper.unique_nonce_entropy + 1) % 256;
	})());

	helper.unique_nonce_entropy = entropy;

	let long = Long.fromNumber(Date.now());
	//	console.log('unique_nonce_uint64 date\t',
	//	ByteBuffer.allocate(8).writeUint64(long).toHex(0))
	//	console.log('unique_nonce_uint64 entropy\t',
	//	ByteBuffer.allocate(8).writeUint64(Long.fromNumber(entropy)).toHex(0))
	long = long.shiftLeft(8).or(Long.fromNumber(entropy));
	//	console.log('unique_nonce_uint64 shift8\t',
	//	ByteBuffer.allocate(8).writeUint64(long).toHex(0))
	return long.toString();
};

/* Todo, set fees */
helper.to_json = (tr, broadcast = false) => (((transaction, isBroadcast) => {
	const tr_object = ops.signed_transaction.toObject(transaction);
	if (isBroadcast) {
		const net = Apis.instance().networkApi();
		console.log('... tr_object', JSON.stringify(tr_object));
		return net.exec('broadcast_transaction', [tr_object]);
	}
	return tr_object;
})(tr, broadcast));

helper.signed_tr_json = (tr, private_keys) => {
	const tr_buffer = ops.transaction.toBuffer(tr);
	tr = ops.transaction.toObject(tr);
	tr.signatures = (() => {
		const result = [];
		const count = private_keys.length;
		for (let i = 0; count > 0 ? i < count : i > count; i += 1) {
			const private_key = private_keys[i];
			result.push(Signature.signBuffer(tr_buffer, private_key).toHex());
		}
		return result;
	})();
	return tr;
};

helper.expire_in_min = (min) => Math.round(Date.now() / 1000) + (min * 60);

helper.seconds_from_now = (timeout_sec) => Math.round(Date.now() / 1000) + timeout_sec;

/**
    Print to the console a JSON representation of any object in
    @graphene/serializer { types }
*/
helper.template = (name, debug = { use_default: true, annotate: true }) => {
	const so = ops[name];
	if (!so) {
		throw new Error(`unknown serializer_operation_type ${name}`);
	}
	return so.toObject(undefined, debug);
};

helper.new_operation = (serializer_operation_type_name) => {
	const so = ops[serializer_operation_type_name];
	if (!so) {
		throw new Error(`unknown serializer_operation_type ${serializer_operation_type_name}`);
	}
	const object = so.toObject(undefined, { use_default: true, annotate: true });
	return so.fromObject(object);
};

helper.instance = (ObjectId) => ObjectId.substring('0.0.'.length);

module.exports = helper;
