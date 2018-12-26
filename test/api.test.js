import assert from 'assert';
import { expect } from 'chai';

import echo, { constants } from '../index';

describe('API', () => {
	before(async () => {
		await echo.connect('ws://195.201.164.54:6311', {
			connectionTimeout: 5000,
			maxRetries: 5,
			pingTimeout: 3000,
			pingInterval: 3000,
			debug: false,
			apis: constants.WS_CONSTANTS.CHAIN_APIS,
		});
	});

	describe('NETWORK API', () => {

		describe('- brodcast transaction', () => {
			it('test', async () => {
				try {
					const tr = {
						ref_block_num: 65202,
						ref_block_prefix: 3760156356,
						expiration: 1545316234,
						operations: [[
							0,
							{
								fee: {
									amount: { low: 20, high: 0, unsigned: false },
									asset_id: 0
								},
								from: 18,
								to: 28,
								amount:{
									amount: { low: 10000, high: 0, unsigned: false },
									asset_id: 0
								},
								extensions: []
							}
						]],
						signatures: [
							{
								type: 'Buffer',
								data: [32,24,169,211,220,150,7,221,134,40,146,51,230,57,184,192,134,179,130,203,56,44,62,48,10,130,198,212,2,22,21,235,231,62,132,12,255,182,1,89,232,154,72,139,70,62,129,70,90,134,45,152,164,42,222,254,20,176,117,208,157,229,161,54,17]
							}
						],
						signer_private_keys: [],
						tr_buffer: {
							type: 'Buffer',
							data: [178,254,196,110,31,224,138,167,27,92,1,0,20,0,0,0,0,0,0,0,0,18,28,16,39,0,0,0,0,0,0,0,0,0,0]
						},
						signed: true
					};
					await echo.api.broadcastTransaction(tr);
				} catch (err) {
					assert.equal(
						err.message,
						'Day of month value is out of range 1..31: Day of month value is out of range 1..31: unable to convert ISO-formatted string to fc::time_point_sec'
					);
				}
			});
		});

		describe('- brodcast block', () => {
			it('test', (done) => {
				if (echo.api.broadcastBlock instanceof Function) {
					done();
				}
			});
		});
	});

	describe('ASSET API', () => {

		describe('- get asset holders (start = 1, limit = 1)', () => {
			it('test', async () => {
				const result = await echo.api.getAssetHolders(constants.CORE_ASSET_ID, 1, 1);

				expect(result).to.be.an('array').that.is.not.empty;
				expect(result[0]).to.be.an('object').that.is.not.empty;
				expect(result[0].name).to.be.a('string');
				expect(result[0].account_id).to.be.a('string');
				expect(result[0].amount).to.be.a('string');
			});
		});

		describe('- get asset holders count', () => {
			it('test', async () => {
				const result = await echo.api.getAssetHoldersCount(constants.CORE_ASSET_ID);

				expect(result).to.be.a('number');
			});
		});

		describe('- get all asset holders', () => {
			it('test', async () => {
				const result = await echo.api.getAllAssetHolders();

				expect(result).to.be.an('array').that.is.not.empty;
				expect(result[0]).to.be.an('object').that.is.not.empty;
				expect(result[0].asset_id).to.be.a('string');
				expect(result[0].count).to.be.a('number');
			});
		});

	});

	after(() => {
		echo.disconnect();
	});
});
