const { inspect } = require('util');
const { default: echo } = require('../dist');

(async () => {
	await echo.connect('ws://195.201.164.54:6311');
	console.log(inspect(await echo.api.getFullAccounts(process.argv.slice(2)), false, null, true));
})().then(() => process.exit(0)).catch((err) => {
	console.error((err instanceof Error) || typeof err !== 'object' ? err : inspect(err, false, null, true));
	process.exit(err.status || 1);
});
