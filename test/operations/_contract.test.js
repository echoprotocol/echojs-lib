export const bytecode = '60806040526000805534801561001457600080fd5b506040516020806104dc83398101806040528101908080519060200190929190505050806000819055505061048e8061004e6000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632e1a7d4d1461007257806386be3f80146100b3578063b6854a21146100f4578063d0e30db01461011f578063e3d670d71461013d575b600080fd5b34801561007e57600080fd5b5061009d60048036038101908080359060200190929190505050610194565b6040518082815260200191505060405180910390f35b3480156100bf57600080fd5b506100de60048036038101908080359060200190929190505050610328565b6040518082815260200191505060405180910390f35b34801561010057600080fd5b50610109610339565b6040518082815260200191505060405180910390f35b61012761033f565b6040518082815260200191505060405180910390f35b34801561014957600080fd5b5061017e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061044a565b6040518082815260200191505060405180910390f35b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561024d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f696e73756666696369656e742066756e6473000000000000000000000000000081525060200191505060405180910390fd5b81600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f193505050501580156102e0573d6000803e3d6000fd5b50600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600081600081905550819050919050565b60005481565b600080341115156103b8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260088152602001807f6e6f2076616c756500000000000000000000000000000000000000000000000081525060200191505060405180910390fd5b34600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905090565b600160205280600052604060002060009150905054815600a165627a7a72305820c733b8066873db3b0610d196216e8b98d39bf16bb07be7bcd3913b8492623f210029';

export const abi = [{
	inputs: [{ name: '_variable', type: 'uint256' }],
	payable: false,
	stateMutability: 'nonpayable',
	type: 'constructor'
}, {
	constant: true,
	inputs: [{ name: '', type: 'address' }],
	name: 'balance',
	outputs: [{ name: '', type: 'uint256' }],
	payable: false,
	stateMutability: 'view',
	type: 'function'
}, {
	constant: true,
	inputs: [],
	name: 'variable',
	outputs: [{ name: '', type: 'uint256' }],
	payable: false,
	stateMutability: 'view',
	type: 'function'
}, {
	constant: false,
	inputs: [{ name: 'newValue', type: 'uint256' }],
	name: 'setVariable',
	outputs: [{ name: '', type: 'uint256' }],
	payable: false,
	stateMutability: 'nonpayable',
	type: 'function'
}, {
	constant: false,
	inputs: [],
	name: 'deposit',
	outputs: [{ name: '', type: 'uint256' }],
	payable: true,
	stateMutability: 'payable',
	type: 'function'
}, {
	constant: false,
	inputs: [{ name: 'value', type: 'uint256' }],
	name: 'withdraw',
	outputs: [{ name: '', type: 'uint256' }],
	payable: false,
	stateMutability: 'nonpayable',
	type: 'function'
}];