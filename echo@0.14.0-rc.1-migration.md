* [x] Add field `btc_block_number` to `sidechain_btc_aggregate_operation` and `btc_aggregating_object`
* [x] Add fields `btc_deposit_withdrawal_min`, `btc_deposit_withdrawal_fee` to `sidechain_config`
* [ ] Update contract subscription
	* [ ] Update the contracts logs subscription filter
	* [ ] Add method `unsubscribe_contract_logs` in database API
* [ ] Bitcoin key to configure-keys
* [x] Implement 24 hours delay for deposit and withdrawal processing in Ethereum sidechain
	* [x] `sidechain_eth_send_deposit_operation`
	* [x] `sidechain_eth_send_withdraw_operation`
	* [x] `sidechain_erc20_send_deposit_operation`
	* [x] `sidechain_erc20_send_withdraw_operation`
* [x] Add functionality to update ETH contract address
	* [x] Add `sidechain_eth_update_contract_address_operation`
	* [x] Add field `eth_update_contract_address` to `sidechain_config`
* [x] Add methods to wallet-api
	* [x] `get_contract_history`
	* [x] `get_relative_contract_history`
* [x] Change arguments of `get_contract_logs` method and make it async
* [x] Change type of argument in wallet-api method `get_btc_address` from `account_id` to `string`
* [x] Rename wallet-api method `generate_eth_address` to `create_eth_address`
* [x] Rename `deposit_erc20_token_object` to `erc20_deposit_token_object`
* [x] Rename `withdraw_erc20_token_object` to `erc20_withdraw_token_object`
* [x] wallet-api's `create_contract` method receives `amount` argument as `number|string|BigNumber` instead of `uint64`
* [x] wallet-api's `call_contract` method receives `amount` argument as `number|string|BigNumber` instead of `uint64`
* [x] Remove field `min_btc_deposit_withdrawal` from `sidechain_config`
* [ ] Remove field `immutable_parameters` from `chain_property_object`

* [ ] Update contract's logs' filter
* [ ] Update operations' id's in docs
* [ ] Tests
	* [ ] `get_contract_history`
	* [ ] `get_relative_contract_history`
	* [ ] `get_contract_logs`
