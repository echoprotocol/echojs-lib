import "babel-polyfill";
import { expect } from 'chai';
import WS from '../src/echo/ws'
import WSAPI from '../src/echo/ws-api'
import Cache from '../src/echo/cache'
import API from '../src/echo/api'

import { inspect } from 'util';

// const url = 'wss://echo-devnet-node.pixelplex.io/ws';
const url = 'ws://195.201.164.54:6311';

describe('API', () => {
    describe('database', () => {
        const ws = new WS();
        beforeEach(async () => {
            await ws.connect(url, { apis: ['database', 'network_broadcast', 'history', 'registration', 'asset', 'login', 'network_node']});
        });
        afterEach(async () => {
            await ws.close();
        });

        describe('configs', () => {
            describe('#getChainProperties()', () => {
                it('should get chain properties', async () => {
                    try {
                        const wsApi = new WSAPI(ws);
                        const cache = new Cache();
                        const api = new API(cache, wsApi);

                        const chainProperties =  await api.getChainProperties();

                        expect(chainProperties).to.be.an('object');
                        expect(chainProperties).to.have.property('id');
                        expect(chainProperties).to.have.property('chain_id');
                        expect(chainProperties).to.have.property('immutable_parameters');
                        expect(chainProperties).to.have.nested.property('immutable_parameters.min_committee_member_count');
                        expect(chainProperties).to.have.nested.property('immutable_parameters.min_witness_count');
                        expect(chainProperties).to.have.nested.property('immutable_parameters.num_special_accounts');
                        expect(chainProperties).to.have.nested.property('immutable_parameters.num_special_assets');

                        expect(chainProperties).to.deep.equal(cache.chainProperties);
                    } catch (e) {
                        throw e;
                    }
                }).timeout(5000);
            });
            describe('#getGlobalProperties()', () => {
                it('should get global properties', async () => {
                    try {
                        const wsApi = new WSAPI(ws);
                        const cache = new Cache();
                        const api = new API(cache, wsApi);

                        const globalProperties =  await api.getGlobalProperties();

                        expect(globalProperties).to.be.an('object');
                        expect(globalProperties).to.have.property('id');
                        expect(globalProperties).to.have.property('next_available_vote_id');
                        expect(globalProperties).to.have.property('active_committee_members');
                        expect(globalProperties).to.have.property('active_witnesses');
                        expect(globalProperties).to.have.nested.property('parameters.current_fees');
                        expect(globalProperties).to.have.nested.property('parameters.block_interval');
                        expect(globalProperties).to.have.nested.property('parameters.maintenance_interval');
                        expect(globalProperties).to.have.nested.property('parameters.maintenance_skip_slots');
                        expect(globalProperties).to.have.nested.property('parameters.committee_proposal_review_period');
                        expect(globalProperties).to.have.nested.property('parameters.maximum_transaction_size');
                        expect(globalProperties).to.have.nested.property('parameters.maximum_block_size');
                        expect(globalProperties).to.have.nested.property('parameters.maximum_time_until_expiration');
                        expect(globalProperties).to.have.nested.property('parameters.maximum_proposal_lifetime');
                        expect(globalProperties).to.have.nested.property('parameters.maximum_asset_whitelist_authorities');
                        expect(globalProperties).to.have.nested.property('parameters.maximum_asset_feed_publishers');
                        expect(globalProperties).to.have.nested.property('parameters.maximum_witness_count');
                        expect(globalProperties).to.have.nested.property('parameters.maximum_committee_count');
                        expect(globalProperties).to.have.nested.property('parameters.maximum_authority_membership');
                        expect(globalProperties).to.have.nested.property('parameters.reserve_percent_of_fee');
                        expect(globalProperties).to.have.nested.property('parameters.lifetime_referrer_percent_of_fee');
                        expect(globalProperties).to.have.nested.property('parameters.cashback_vesting_period_seconds');
                        expect(globalProperties).to.have.nested.property('parameters.cashback_vesting_threshold');
                        expect(globalProperties).to.have.nested.property('parameters.count_non_member_votes');
                        expect(globalProperties).to.have.nested.property('parameters.allow_non_member_whitelists');
                        expect(globalProperties).to.have.nested.property('parameters.witness_pay_per_block');
                        expect(globalProperties).to.have.nested.property('parameters.worker_budget_per_day');
                        expect(globalProperties).to.have.nested.property('parameters.max_predicate_opcode');
                        expect(globalProperties).to.have.nested.property('parameters.fee_liquidation_threshold');
                        expect(globalProperties).to.have.nested.property('parameters.accounts_per_fee_scale');
                        expect(globalProperties).to.have.nested.property('parameters.account_fee_scale_bitshifts');
                        expect(globalProperties).to.have.nested.property('parameters.max_authority_depth');
                        expect(globalProperties).to.have.nested.property('parameters.extensions');

                        expect(globalProperties).to.deep.equal(cache.globalProperties);
                    } catch (e) {
                        throw e;
                    }
                }).timeout(5000);
            });
            describe('#getConfig()', () => {
                it('should get config properties', async () => {
                    try {
                        const wsApi = new WSAPI(ws);
                        const cache = new Cache();
                        const api = new API(cache, wsApi);

                        const config =  await api.getConfig();

                        expect(config).to.be.an('object');
                        expect(config).to.deep.equal(cache.config);
                    } catch (e) {
                        throw e;
                    }
                }).timeout(5000);
            });
            describe('#getChainId()', () => {
                it('should get chain id', async () => {
                    try {
                        const wsApi = new WSAPI(ws);
                        const cache = new Cache();
                        const api = new API(cache, wsApi);

                        const chainId = await api.getChainId();

                        expect(chainId).to.be.an('string');
                    } catch (e) {
                        throw e;
                    }
                }).timeout(5000);
            });
            describe('#getDynamicGlobalProperties()', () => {
                it('should get dynamic global properties', async () => {
                    try {
                        const wsApi = new WSAPI(ws);
                        const cache = new Cache();
                        const api = new API(cache, wsApi);

                        const dynamicGlobalProperties = await api.getDynamicGlobalProperties();

                        expect(dynamicGlobalProperties).to.be.an('object');
                        expect(dynamicGlobalProperties).to.deep.equal(cache.dynamicGlobalProperties);
                    } catch (e) {
                        throw e;
                    }
                }).timeout(5000);
            });
        });

        describe('#getBlock()', () => {
            it('should get block and save it to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);
                    const blockNumber = 20;
                    const block =  await api.getBlock(blockNumber);

                    expect(block).to.deep.equal(cache.blocks.get(blockNumber));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe.skip('#getTransaction()', () => {
            it('should get transaction and save it to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);
                    const blockNumber = 205378;
                    const transactionIndex = 0;
                    const transaction = await api.getTransaction(blockNumber, transactionIndex);

                    expect(transaction).to.deep.equal(cache.transactionsByBlockAndIndex.get(`${blockNumber}:${transactionIndex}`));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAccounts()', () => {
            it('should get accounts and save it to cache', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);
                    const accountId1 = '1.2.5';
                    const accountId2 = '1.2.6';
                    const accounts = await api.getAccounts([accountId1, accountId2]);

                    expect(accounts).to.be.an('array');
                    expect(accounts).to.deep.include(cache.accountsById.get(accountId1));
                    expect(accounts).to.deep.include(cache.accountsById.get(accountId2));
                    expect(accounts).to.deep.include(cache.objectsById.get(accountId1));
                    expect(accounts).to.deep.include(cache.objectsById.get(accountId2));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAccountCount()', () => {
            it('should get account count', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountCount = await api.getAccountCount();

                    expect(accountCount).to.be.an('number');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#lookupAssetSymbols()', () => {
            it('should get asset by symbol and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const assetKey = 'ECHO';
                    const assetId = '1.3.0';
                    const assets = await api.lookupAssetSymbols([assetKey]);

                    expect(assets).to.be.an('array');
                    expect(assets).to.deep.include(cache.assetByAssetId.get(assetId));
                    expect(assets).to.deep.include(cache.objectsById.get(assetId));
                    expect(assets).to.deep.include(cache.assetBySymbol.get(assetKey));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAssets()', () => {
            it('should get assets by id and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const assetId1 = '1.3.0';

                    const assets = await api.getAssets([assetId1]);

                    expect(assets).to.be.an('array');
                    expect(assets).to.deep.include(cache.assetByAssetId.get(assetId1));
                    expect(assets).to.deep.include(cache.objectsById.get(assetId1));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getObjects()', () => {
            it('should get objects by id and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const assetId = '1.3.0';
                    const accountId = '1.2.2';
                    const assetSymbol = 'ECHO';

                    const objects = await api.getObjects([accountId, assetId]);

                    const assetName = objects[0].name;

                    expect(objects).to.be.an('array');
                    expect(objects).to.deep.include(cache.objectsById.get(assetId));
                    expect(objects).to.deep.include(cache.objectsById.get(accountId));
                    expect(objects).to.deep.include(cache.assetByAssetId.get(assetId));
                    expect(objects).to.deep.include(cache.assetBySymbol.get(assetSymbol));
                    expect(objects).to.deep.include(cache.accountsById.get(accountId));
                    expect(objects).to.deep.include(cache.accountsByName.get(assetName));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getCommitteeMembers()', () => {
            it('should get committee member by id and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const committeeMember = '1.5.1';

                    const objects = await api.getCommitteeMembers([committeeMember]);

                    expect(objects).to.be.an('array');
                    expect(objects).to.deep.include(cache.objectsById.get(committeeMember));
                    expect(objects).to.deep.include(cache.committeeMembersByCommitteeMemberId.get(committeeMember));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAccountByName()', () => {
            it('should get account by name and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountName = 'relaxed-committee-account';

                    const account = await api.getAccountByName(accountName);

                    expect(account).to.exist;

                    const { id } = account;

                    expect(account).to.deep.equal(cache.objectsById.get(id));
                    expect(account).to.deep.equal(cache.accountsById.get(id));
                    expect(account).to.deep.equal(cache.accountsByName.get(accountName));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getWitnesses()', () => {
            it('should get witnesses by id and save it in multi caches', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const witnessId = '1.6.1';

                    const objects = await api.getWitnesses([witnessId]);

                    expect(objects).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAllContracts()', () => {
            it('should get all contracts', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const contracts = await api.getAllContracts();
                    expect(contracts).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#lookupAccounts()', () => {
            it('should get account by name and limit', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const lowerBoundName = 't';

                    const accounts = await api.lookupAccounts(lowerBoundName);
                    expect(accounts).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#listAssets()', () => {
            it('should get assets by name and limit', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const lowerBoundSymbol = 'E';

                    const assets = await api.listAssets(lowerBoundSymbol);
                    expect(assets).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getBlockHeader()', () => {
            it('should get block header by block number', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const blockNumber = 200;
                    const blockHeader =  await api.getBlockHeader(blockNumber);

                    expect(blockHeader).to.deep.equal(cache.blockHeadersByBlockNumber.get(blockNumber));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe.skip('#getContract()', () => {
            it('should get contract', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const contractId = '1.16.0';
                    const contract =  await api.getContract(contractId);

                    expect(contract).to.deep.equal(cache.fullContractsByContractId.get(contractId));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe.skip('#getContracts()', () => {
            it('should get contracts', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const contractId = '1.16.0';
                    const contracts =  await api.getContracts([contractId]);

                    expect(contracts).to.deep.include(cache.contractsByContractId.get(contractId));
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#registerAccount()', () => {
            it('should throw an user already exist error', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountName = 'test101';
                    const ownerKey = 'ECHO59St8wBpta2ZREBnA3dQQTVFBrEcx5UK12Tm5geG7kv7Hwyzyc';
                    const activeKey = 'ECHO59St8wBpta2ZREBnA3dQQTVFBrEcx5UK12Tm5geG7kv7Hwyzyc';
                    const memo = 'ECHO59St8wBpta2ZREBnA3dQQTVFBrEcx5UK12Tm5geG7kv7Hwyzyc';
                    const echoRandKey = 'DET3vw54ewEd7G8aKGHSzC5QbKpGhWEaRH1EvscHMbwZNVW';

                    await api.registerAccount(accountName, ownerKey, activeKey, memo, echoRandKey);


                    expect.fail(null, null, 'registerAccount() did not reject with an error')
                } catch (_) {}
            }).timeout(5000);
        });
    });

    describe('history', () => {
        const ws = new WS();
        beforeEach(async () => {
            await ws.connect(url, { apis: ['database', 'network_broadcast', 'history', 'registration', 'asset', 'login']});
        });
        afterEach(async () => {
            await ws.close();
        });
        describe('#getAccountHistory()', () => {
            it('should get account history', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountId = '1.2.2';

                    const history = await api.getAccountHistory(accountId);
                    expect(history).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getRelativeAccountHistory()', () => {
            it('should get relative account history', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountId = '1.2.2';
                    const start = 0;
                    const stop = 0;
                    const limit = 10;

                    const history = await api.getRelativeAccountHistory(accountId, stop, limit, start);
                    expect(history).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe('#getAccountHistoryOperations()', () => {
            it('should get account history operations', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const accountId = '1.2.2';
                    const operationId = 0;
                    const start = '1.11.0';
                    const stop = '1.11.0';
                    const limit = 10;

                    const history = await api.getAccountHistoryOperations(accountId, operationId, start, stop, limit);
                    expect(history).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
        describe.skip('#getContractHistory()', () => {
            it('should get contract history', async () => {
                try {
                    const wsApi = new WSAPI(ws);
                    const cache = new Cache();
                    const api = new API(cache, wsApi);

                    const contractId = '1.16.1';
                    const start = '1.11.0';
                    const stop = '1.11.0';
                    const limit = 10;

                    const history = await api.getContractHistory(contractId, stop, limit, start);
                    expect(history).to.be.an('array');
                } catch (e) {
                    throw e;
                }
            }).timeout(5000);
        });
    });
});
