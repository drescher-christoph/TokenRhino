//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {Presale} from "../src/Presale.sol";
import {ERC20Mock} from "../test/mocks/ERC20Mock.sol";

contract DeployPresale is Script {

    uint256 constant TOKENS_FOR_SALE = 500_000 ether;   // in kleinsten Einheiten (18 Decimals)
    uint256 constant HARD_CAP_WEI    = 50 ether;        // z.B. 50 ETH
    uint256 constant SOFT_CAP_WEI    = 30 ether;        // z.B. 20 ETH
    uint256 constant MIN_CONTRIB     = 0.05 ether;      // 0.05 ETH
    uint256 constant MAX_CONTRIB     = 5 ether;         // 5 ETH (0 = kein Limit)


    function run() external {
        vm.startBroadcast();

        ERC20Mock token = new ERC20Mock(
            "TokenRhino",
            "TRH",
            msg.sender, // initial account
            1_000_000 ether // initial balance
        );

        Presale presale = new Presale(
            msg.sender,               // _owner
            address(token),           // _tokenAddress
            "TokenRhino",             // _tokenName (nur Info)
            TOKENS_FOR_SALE,          // _tokenSupplyInUnits (zu verkaufende Menge)
            MAX_CONTRIB,              // _maxContribution
            HARD_CAP_WEI,             // _hardCapWei
            SOFT_CAP_WEI,             // _softCapWei
            MIN_CONTRIB               // _minContribution
        );

        bool ok = token.transfer(address(presale), TOKENS_FOR_SALE);
        require(ok, "prefund failed");

        console2.log("Token   :", address(token));
        console2.log("Presale :", address(presale));
        console2.log("Presale funded with", TOKENS_FOR_SALE / 1e18, "TRH");
        vm.stopBroadcast();
    }
}