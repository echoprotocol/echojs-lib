const PrivateKey = require('../../ecc/src/PrivateKey');
const key = require('../../ecc/src/KeyUtils');

const { get, set } = require('./state');

const _keyCachePriv = {};
const _keyCachePub = {};

class AccountLogin {

	constructor() {
		const state = { loggedIn: false, roles: ['active', 'memo'] };
		this.get = get(state);
		this.set = set(state);
		this.subs = {};
	}

	addSubscription(cb) {
		this.subs[cb] = cb;
	}

	setRoles(roles) {
		this.set('roles', roles);
	}

	generateKeys(accountName, password, roles, prefix) {
		if (!accountName || !password) {
			throw new Error('Account name or password required');
		}
		if (password.length < 12) {
			throw new Error('Password must have at least 12 characters');
		}
		const privKeys = {};
		const pubKeys = {};
		(roles || this.get('roles')).forEach((role) => {
			const seed = accountName + role + password;
			const pkey = _keyCachePriv[seed] ?
				_keyCachePriv[seed] : PrivateKey.fromSeed(key.normalize_brainKey(seed));
			_keyCachePriv[seed] = pkey;

			privKeys[role] = pkey;
			pubKeys[role] = _keyCachePub[seed] ? _keyCachePub[seed] : pkey.toPublicKey().toString(prefix);

			_keyCachePub[seed] = pubKeys[role];
		});
		return { privKeys, pubKeys };
	}

	checkKeys({ accountName, password, auths }) {
		if (!accountName || !password || !auths) {
			throw new Error('checkKeys: Missing inputs');
		}
		let hasKey = false;
		Object.keys(auths).forEach((role) => {
			const { privKeys, pubKeys } = this.generateKeys(accountName, password, [role]);
			auths[role].forEach((pubKey) => {
				if (pubKey[0] === pubKeys[role]) {
					hasKey = true;
					this.set(role, { priv: privKeys[role], pub: pubKeys[role] });
				}
			});
		});

		if (hasKey) {
			this.set('name', accountName);
		}
		this.set('loggedIn', hasKey);
		return hasKey;
	}

	signTransaction(tr) {
		let hasKey = false;
		this.get('roles').forEach((role) => {
			const myKey = this.get(role);
			if (myKey) {
				hasKey = true;
				// console.log('adding signer:', myKey.pub);
				tr.add_signer(myKey.priv, myKey.pub);
			}
		});
		if (!hasKey) {
			throw new Error('You do not have any private keys to sign this transaction');
		}
	}

}

const accountLogin = new AccountLogin();

module.exports = accountLogin;
