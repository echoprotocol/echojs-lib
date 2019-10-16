/** @type {Array.<{ test:string, bytesCount:number|any }>} */
const bytesCountTest = [
	{ test: 'bytes count is not a number', bytesCount: 'not_a_number' },
	{ test: 'bytes count is not a integer', bytesCount: 1.23 },
];

export default bytesCountTest;
