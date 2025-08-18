//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {Presale} from "./Presale.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PresaleFactory is Ownable, ReentrancyGuard {
         
    uint16  public feeBps;           // z.B. 250 = 2.5%
    address[] public allPresales;    // Liste
    mapping(address => address[]) public presalesByCreator; // Creator -> Presales

    // Optional: Param-Policies
    uint256 public minSoftCapWei;    // z.B. 5 ether
    uint256 public minDuration;      // z.B. 3 Tage

    event PresaleCreated(address indexed creator, address presale, address token);
    event FeeWithdrawn(address indexed to, uint256 amount);
    event PolicyUpdated(/* … */);

    constructor() Ownable(msg.sender) {}

    function createPresale() public {}

    function withdrawFees() public onlyOwner {}
    
}