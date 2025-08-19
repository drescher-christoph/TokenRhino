//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {Presale} from "./Presale.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PresaleFactory is Ownable, ReentrancyGuard {

    error InvalidToken();
    error InvalidSupply();
    error InvalidHardCap();
    error InvalidSoftCap();
    error InvalidContributionRange();
    error PriceResolutionTooLow();
         
    uint16  public feeBps;           
    address[] public allPresales;    
    mapping(address => address[]) public presalesByCreator;

    // Optional: Param-Policies
    // uint256 public minSoftCapWei;    
    // uint256 public minDuration;      

    event PresaleCreated(address indexed creator, address presale, address token);
    event FeeWithdrawn(address indexed to, uint256 amount);
    event FeeReceived(address indexed presale, uint256 amount);
    event PolicyUpdated(/* … */);

    constructor(uint16 _tokenFee) Ownable(msg.sender) {
        feeBps = _tokenFee;
    }

    ///////////////////////
    // Receive Functions///
    ///////////////////////

    receive() external payable {
        emit FeeReceived(msg.sender, msg.value);
    }

    ///////////////////////
    // Extern Functions ///
    ///////////////////////

    ///////////////////////
    // Public Functions ///
    ///////////////////////

    function createPresale(
        address _tokenAddress,
        string memory _tokenName,
        uint256 _tokenSupplyInUnits,
        uint256 _hardCapWei,
        uint256 _softCapWei,
        uint256 _minContribution,
        uint256 _maxContribution
    ) public returns (address presale) {
        if (_tokenAddress == address(0)) revert InvalidToken();
        if (_tokenSupplyInUnits == 0) revert InvalidSupply();
        if (_hardCapWei == 0) revert InvalidHardCap();
        if (_softCapWei == 0 || _softCapWei > _hardCapWei) revert InvalidSoftCap();
        if (_maxContribution != 0 && _minContribution > _maxContribution) {
            revert InvalidContributionRange();
        }
        if ( (_tokenSupplyInUnits * 1e18) / _hardCapWei == 0 ) revert PriceResolutionTooLow();

        Presale newPresale = new Presale(
            msg.sender,
            feeBps,
            _tokenAddress,
            _tokenName,
            _tokenSupplyInUnits,
            _hardCapWei,
            _softCapWei,
            _minContribution,
            _maxContribution
        );

        presale = address(newPresale);

        allPresales.push(presale);
        presalesByCreator[msg.sender].push(presale);
        emit PresaleCreated(msg.sender, presale, _tokenAddress);
    }

    function withdrawFees() public onlyOwner {}
    
}