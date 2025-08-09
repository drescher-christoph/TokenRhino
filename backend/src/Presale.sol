//SPDX-License-Identifier: MIT

// Layout of Contract:
// version
// imports
// interfaces, libraries, contracts
// errors
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions

/**
 * @title Presale Contract
 * @author Christoph Drescher
 * @notice 
 */
pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Presale {

    IERC20 public immutable saleToken;

    constructor(address tokenAddress, uint256 startTime, uint256 endTime, uint256 usdPricePerToken) {
        
    }

}