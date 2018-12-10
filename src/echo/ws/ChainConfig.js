const eccConfig = {
	address_prefix: process.env.npm_config__graphene_ecc_default_address_prefix || 'ECHO',
};

const _this = {
	core_asset: 'ECHO',
	address_prefix: 'ECHO',
	expire_in_secs: 15,
	expire_in_secs_proposal: 24 * 60 * 60,
	review_in_secs_committee: 24 * 60 * 60,
	networks: {
		EchoDev: {
			core_asset: 'ECHO',
			address_prefix: 'ECHO',
			chain_id: '233ae92c7218173c76b5ffad9487b063933eec714a12e3f2ea48026a45262934',
		},
	},

	/** Set a few properties for known chain IDs. */
	// eslint-disable-next-line consistent-return
	setChainId(chainId) {

		let i;
		let	len;
		let	network;
		let	networkName;
		const ref = Object.keys(_this.networks);

		for (i = 0, len = ref.length; i < len; i += 1) {

			networkName = ref[i];
			network = _this.networks[networkName];

			if (network.chain_id === chainId) {

				_this.network_name = networkName;

				if (network.address_prefix) {
					_this.address_prefix = network.address_prefix;
					eccConfig.address_prefix = network.address_prefix;
				}

				// console.log("INFO    Configured for", networkName, ":", network.core_asset, "\n");

				return {
					networkName,
					network,
				};
			}
		}

		if (!_this.network_name) {
			console.log('Unknown chain id (this may be a testnet)', chainId);
		}


	},

	reset() {
		_this.core_asset = 'ECHO';
		_this.address_prefix = 'ECHO';
		eccConfig.address_prefix = 'ECHO';
		_this.expire_in_secs = 15;
		_this.expire_in_secs_proposal = 24 * 60 * 60;
	},

	setPrefix(prefix = 'ECHO') {
		_this.address_prefix = prefix;
		eccConfig.address_prefix = prefix;
	},
};

module.exports = _this;
