// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FUSDTToken is ERC20 {
    constructor() ERC20("fUSDT coin", "fUSDT") {}

    function mint(address _account, uint256 _amount) external {
        _mint(_account, _amount);
    }
}
