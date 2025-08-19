//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {Presale} from "../src/Presale.sol";
import {DeployMockERC20} from "./DeployMockERC20.s.sol";
import {ERC20Mock} from "../test/mocks/ERC20Mock.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployPresale is Script {

    uint256 constant TOKENS_FOR_SALE = 800_000 ether;   // in kleinsten Einheiten (18 Decimals)
    uint256 constant HARD_CAP_WEI    = 50 ether;        // z.B. 50 ETH
    uint256 constant SOFT_CAP_WEI    = 30 ether;        // z.B. 20 ETH
    uint256 constant MIN_CONTRIB     = 0.05 ether;      // 0.05 ETH
    uint256 constant MAX_CONTRIB     = 15 ether;         // 5 ETH (0 = kein Limit)


    function run() external returns (Presale, ERC20Mock) {
        vm.startBroadcast();

        DeployMockERC20 deployMockERC20 = new DeployMockERC20();
        ERC20Mock rhinoToken = deployMockERC20.run();

        Presale presale = new Presale(
            msg.sender,               
            250,
            address(rhinoToken),          
            "TokenRhino",            
            TOKENS_FOR_SALE,         
            HARD_CAP_WEI,            
            SOFT_CAP_WEI,             
            MIN_CONTRIB,              
            MAX_CONTRIB              
        );

        bool ok = rhinoToken.transfer(address(presale), TOKENS_FOR_SALE);
        require(ok, "prefund failed");

        console2.log("Token   :", address(rhinoToken));
        console2.log("Presale :", address(presale));
        vm.stopBroadcast();

        return (presale, rhinoToken);
    }

    function runLocal() external returns (Presale, ERC20Mock) {
        DeployMockERC20 deployMockERC20 = new DeployMockERC20();
        ERC20Mock rhinoToken = deployMockERC20.run();

        Presale presale = new Presale(
            msg.sender,               
            250,
            address(rhinoToken),          
            "TokenRhino",            
            TOKENS_FOR_SALE,         
            HARD_CAP_WEI,            
            SOFT_CAP_WEI,             
            MIN_CONTRIB,              
            MAX_CONTRIB              
        );

        bool ok = rhinoToken.transfer(address(presale), TOKENS_FOR_SALE);
        require(ok, "prefund failed");

        console2.log("Token   :", address(rhinoToken));
        console2.log("Presale :", address(presale));

        return (presale, rhinoToken);
    }
}