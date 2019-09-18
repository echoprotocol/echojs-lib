/* eslint-disable no-console */
import { compileContract } from './__testContract';
import { inspect } from 'util';

compileContract().then(() => console.log('Test contract compiled')).catch((error) => {
	console.error('Test contract compilation failed with error:');
	console.error(error instanceof Error || typeof error !== 'string' ? error : inspect(error, false, null, true));
	process.exit(1);
});
