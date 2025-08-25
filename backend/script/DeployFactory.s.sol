//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {Presale} from "../src/Presale.sol";
import {PresaleFactory} from "../src/PresaleFactory.sol";
import {ERC20Mock} from "../test/mocks/ERC20Mock.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployFactory is Script {

    uint16 constant TOKEN_FEE = 250;  
    uint256 constant CREATE_FEE = 0.01 ether; 
    uint256 constant SOFT_CAP_WEI    = 30 ether;        
    uint256 constant MIN_CONTRIB     = 0.05 ether;    

    function run() external returns (PresaleFactory) {
        vm.startBroadcast();

        PresaleFactory factory = new PresaleFactory(
            TOKEN_FEE,
            CREATE_FEE 
        );
        
        vm.stopBroadcast();

        return factory;
    }

    function runLocal() external returns (PresaleFactory) {
        PresaleFactory factory = new PresaleFactory(
            TOKEN_FEE,
            CREATE_FEE
        );
        return factory;
    }
}