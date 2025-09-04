//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {Presale} from "../src/Presale.sol";
import {ERC20Mock} from "../test/mocks/ERC20Mock.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployMockERC20 is Script {

    function run() external returns (ERC20Mock) {
        vm.startBroadcast();
        ERC20Mock token = new ERC20Mock(
            "SAVE THE BEES",
            "STBE",
            msg.sender, 
            1_000_000_000 ether 
        );
        vm.stopBroadcast();
        return token;
    }

    function runLocal() external returns (ERC20Mock) {

        ERC20Mock token = new ERC20Mock(
            "TokenRhino",
            "TRH",
            msg.sender, // initial account
            1_000_000 ether // initial balance
        );
        
        return token;
    }

        
}

// USAGE:
// DeployMockERC20 deployMockERC20 = new DeployMockERC20();
// ERC20Mock rhinoToken = deployMockERC20.run();