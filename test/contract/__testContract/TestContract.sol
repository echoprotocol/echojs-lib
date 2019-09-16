pragma solidity ^0.4.22;

contract TestContract {

	uint256 variable = 0;
	mapping (address => uint256) balanceOf;

	function getVariable() public view returns (uint256) {
		return variable;
	}

	function getBalanceOf(address account) public view returns (uint256) {
		return balanceOf[account];
	}

	function() public payable {
		deposit();
	}

	constructor(uint256 _variable) public {
		variable = _variable;
	}

	function setVariable(uint256 newValue) public returns (uint256) {
		variable = newValue;
		return newValue;
	}

	function deposit() public payable returns (uint256) {
		require(msg.value > 0, "no value");
		balanceOf[msg.sender] += msg.value;
		return balanceOf[msg.sender];
	}

	function withdraw(uint256 value) public returns (uint256) {
		require(balanceOf[msg.sender] >= value, "insufficient funds");
		balanceOf[msg.sender] -= value;
		msg.sender.transfer(value);
		return balanceOf[msg.sender];
	}

}
