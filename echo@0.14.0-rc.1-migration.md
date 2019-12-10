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

* [ ] Update operations' id's in docs
* [ ] Tests
	* [ ] `get_contract_history`
	* [ ] `get_relative_contract_history`
