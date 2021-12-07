// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SVSToken is ERC20, Ownable {
    address public masterchefAddress;
    address public stackingAddress;

    constructor() ERC20("SVS coin", "SVS") {}

    function setMasterchefAddress(address _address) external onlyOwner {
        require(_address != address(0));
        masterchefAddress = _address;
    }

    function setStackingAddress(address _address) external onlyOwner {
        require(_address != address(0));
        stackingAddress = _address;
    }

    function mint(address _account, uint256 _amount) external {
        require(
            msg.sender == masterchefAddress || msg.sender == stackingAddress,
            "You are not allowed to mint"
        );
        _mint(_account, _amount);
    }
}
