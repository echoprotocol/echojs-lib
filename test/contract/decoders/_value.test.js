/** @type {Array.<{ test:string, value:string|any, error:string|undefined }>} */
const valueTest = [
	{ test: 'decoding value is not a string', value: 123 },
	{ test: 'length is not 64 chars', value: '0123456789abcdef', error: 'decoding value is not a 32-byte in hex' },
	{
		test: 'not a hex-string',
		value: 'qweasdzxcwersdfxcvertdfgcvbrtyfghvbntyughjbnmyuihjknm,uiojklm,.p',
		error: 'decoding value is not a 32-byte in hex',
	},
];

export default valueTest;
