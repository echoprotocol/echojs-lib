import { ok, strictEqual } from 'assert';

import { Echo, constants } from '../..';
import { url } from '../_test-data';

const { POTENTIAL_PEER_LAST_CONNECTION_DISPOSITION } = constants.NET.PEER_DATABASE;

const echo = new Echo();

/**
 * @template T
 * @typedef {T extends Promise<infer U> ? U : T} UnPromisify
 */

describe('Network API', () => {
	before(async () => await echo.connect(url, { apis: constants.WS_CONSTANTS.CHAIN_APIS }));
	after(async () => await echo.disconnect());
	describe('getConnectedPeers', () => {
		describe('when not connected to any node', () => {
			/** @type {UnPromisify<ReturnType<Echo["api"]["getConnectedPeers"]>>} */
			let result;
			let excepted = true;
			it('should not reject', async () => {
				result = await echo.api.getConnectedPeers();
				excepted = false;
			});
			it('should return array', function () {
				if (excepted) this.skip();
				ok(Array.isArray(result));
			});
			it('that is empty', function () {
				if (excepted || !Array.isArray(result)) this.skip();
				strictEqual(result.length, 0);
			});
		});
	});
	describe('getPotentialPeers', () => {
		/** @type {UnPromisify<ReturnType<Echo["api"]["getPotentialPeers"]>>} */
		let result;
		let excepted = true;
		it('should not rejects', async () => {
			result = await echo.api.getPotentialPeers();
			excepted = false;
		});
		it('should return array', function () {
			if (excepted) this.skip();
			ok(Array.isArray(result));
		});
		it('if is not empty', function () { if (!Array.isArray(result) || result.length === 0) this.skip(); });
		it('every element is object', function () {
			if (!Array.isArray(result) || result.length === 0) this.skip();
			for (const e of result) ok(typeof e === 'object' && e !== null);
		});
		const expectedFields = new Set([
			'endpoint',
			'last_seen_time',
			'last_connection_disposition',
			'last_connection_attempt_time',
			'number_of_successful_connection_attempts',
			'number_of_failed_connection_attempts',
			'last_error',
		]);
		it('with no unexpected fields', function () {
			if (!Array.isArray(result) || result.length === 0) this.skip();
			for (const e of result) {
				for (const field in e) ok(expectedFields.has(field));
			}
		});
		describe('with field "endpoint"', () => {
			/** @type {string[]} */
			let endpoints;
			before(function () {
				if (!Array.isArray(result) || result.length === 0) this.skip();
				endpoints = result.map((e) => e.endpoint);
				ok(endpoints.every((e) => e !== undefined));
			});
			let isString = false;
			it('that is string', () => {
				ok(endpoints.every((e) => typeof e === 'string'));
				isString = true;
			});
			it('that is ip-port url', function () {
				if (!isString) this.skip();
				for (const e of endpoints) {
					const split = e.split(':');
					strictEqual(split.length, 2);
					const [ipString, portString] = split;
					const ipSplit = ipString.split('.');
					strictEqual(ipSplit.length, 4);
					for (const byteString of ipSplit) {
						ok(/^(0|[1-9]\d*)$/.test(byteString));
						const byte = Number.parseInt(byteString, 10);
						ok(byte < 256);
					}
					ok(/^(0|[1-9]\d*)$/.test(portString));
					const port = Number.parseInt(portString, 10);
					ok(port <= 65535);
				}
			});
		});
		describe('with field "last_seen_time"', () => {
			/** @type {string[]} */
			let lastSeenTimes;
			before(function () {
				if (!Array.isArray(result) || result.length === 0) this.skip();
				lastSeenTimes = result.map((e) => e.last_seen_time);
				ok(lastSeenTimes.every((e) => e !== undefined));
			});
			let isString = false;
			it('that is string', () => {
				ok(lastSeenTimes.every((e) => typeof e === 'string'));
				isString = true;
			});
			it('that is ISO time with no miliseconds and "Z" postfix', function () {
				if (!isString) this.skip();
				for (const e of lastSeenTimes) strictEqual(new Date(e + 'Z').toISOString().slice(0, 19), e);
			});
		});
		describe('with field "last_connection_disposition"', () => {
			/** @type {string[]} */
			let lastConnectionDispositions;
			before(function () {
				if (!Array.isArray(result) || result.length === 0) this.skip();
				lastConnectionDispositions = result.map((e) => e.last_connection_disposition);
				ok(lastConnectionDispositions.every((e) => e !== undefined));
			});
			let isString = false;
			it('that is string', () => {
				ok(lastConnectionDispositions.every((e) => typeof e === 'string'));
				isString = true;
			});
			it('that is "POTENTIAL_PEER_LAST_CONNECTION_DISPOSITION"', function () {
				if (!isString) this.skip();
				ok(lastConnectionDispositions.every((e) => {
					return Object.values(POTENTIAL_PEER_LAST_CONNECTION_DISPOSITION).includes(e);
				}));
			});
		});
		describe('with field "last_connection_attempt_time"', () => {
			/** @type {string[]} */
			let lastConnectionAttemptTimes;
			before(function () {
				if (!Array.isArray(result) || result.length === 0) this.skip();
				lastConnectionAttemptTimes = result.map((e) => e.last_connection_attempt_time);
				ok(lastConnectionAttemptTimes.every((e) => e !== undefined));
			});
			let isString = false;
			it('that is string', () => {
				ok(lastConnectionAttemptTimes.every((e) => typeof e === 'string'));
				isString = true;
			});
			it('that is ISO time with no miliseconds and "Z" postfix', function () {
				if (!isString) this.skip();
				for (const e of lastConnectionAttemptTimes) {
					strictEqual(new Date(e + 'Z').toISOString().slice(0, 19), e);
				}
			});
		});
		describe('with field "number_of_successful_connection_attempts"', () => {
			/** @type {number[]} */
			let numbersOfSuccessfulConnectionAttempts;
			before(function () {
				if (!Array.isArray(result) || result.length === 0) this.skip();
				numbersOfSuccessfulConnectionAttempts = result.map((e) => e.number_of_successful_connection_attempts);
				ok(numbersOfSuccessfulConnectionAttempts.every((e) => e !== undefined));
			});
			it('that is number', () => ok(numbersOfSuccessfulConnectionAttempts.every((e) => typeof e === 'number')));
			it('is finite', () => ok(numbersOfSuccessfulConnectionAttempts.every((e) => Number.isFinite(e))));
			it('is integer', () => ok(numbersOfSuccessfulConnectionAttempts.every((e) => Number.isInteger(e))));
			it('is non-negative', () => ok(numbersOfSuccessfulConnectionAttempts.every((e) => e >= 0)));
			it('is less that 2**32', () => ok(numbersOfSuccessfulConnectionAttempts.every((e) => e < 2 ** 32)));
		});
		describe('with field "number_of_failed_connection_attempts"', () => {
			/** @type {number[]} */
			let numbersOfFailedConnectionAttempts;
			before(function () {
				if (!Array.isArray(result) || result.length === 0) this.skip();
				numbersOfFailedConnectionAttempts = result.map((e) => e.number_of_failed_connection_attempts);
				ok(numbersOfFailedConnectionAttempts.every((e) => e !== undefined));
			});
			it('that is number', () => ok(numbersOfFailedConnectionAttempts.every((e) => typeof e === 'number')));
			it('is finite', () => ok(numbersOfFailedConnectionAttempts.every((e) => Number.isFinite(e))));
			it('is integer', () => ok(numbersOfFailedConnectionAttempts.every((e) => Number.isInteger(e))));
			it('is non-negative', () => ok(numbersOfFailedConnectionAttempts.every((e) => e >= 0)));
			it('is less that 2**32', () => ok(numbersOfFailedConnectionAttempts.every((e) => e < 2 ** 32)));
		});
	});
});
