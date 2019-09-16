import { spawn } from 'child_process';
import { readFile } from 'fs-extra';

/** @typedef {{ code: Buffer, abi: import("../../types/_Abi").Abi }} ContractInfo */

/** @type {ContractInfo} */
let contractInfo = null;

async function compileContract() {
	const compiler = spawn(
		process.env.SOLC_PATH || 'solc',
		['--bin', '--abi', '-o', __dirname, `${__dirname}/TestContract.sol`],
	);
	await new Promise((resolve) => compiler.on('close', () => resolve()));
}

/** @returns {Promise<contractInfo>} */
async function getContract() {
	if (contractInfo === null) {
		const [abiText, bytecodeHex] = await Promise.all(['abi', 'bin'].map(async (ext) => {
			return await readFile(`${__dirname}/TestContract.${ext}`, 'utf8');
		}));
		const abi = JSON.parse(abiText);
		const code = Buffer.from(bytecodeHex, 'hex');
		contractInfo = { abi, code };
	}
	return contractInfo;
}

export { compileContract, getContract };
