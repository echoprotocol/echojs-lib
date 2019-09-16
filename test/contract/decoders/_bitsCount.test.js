/** @type {Array.<{ test: string, bitsCount: number|any }>} */
const bitsCountTest = [
	{ test: 'bits count is not a number', bitsCount: 'not_a_number' },
	{ test: 'bits count is not positive', bitsCount: -123 },
	{ test: 'bits count is greater than 256', bitsCount: 257 },
	{ test: 'bits count is not a integer', bitsCount: 123.321 },
	{ test: 'bits count is not divisible to 8', bitsCount: 7 },
];

export default bitsCountTest;