//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {Presale} from "./Presale.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PresaleFactory is Ownable, ReentrancyGuard {

    error PresaleFactory__InvalidToken();
    error PresaleFactory__InvalidSupply();
    error PresaleFactory__InvalidHardCap();
    error PresaleFactory__InvalidSoftCap();
    error PresaleFactory__InvalidContributionRange();
    error PresaleFactory__PriceResolutionTooLow();
    error PresaleFactory__WithdrawFeesFailed();
    error PresaleFactory__NoFeesAvailable();
         
    uint16  public feeBps;       
    uint256 public createFeeWei;    

    uint256 accuredCreateFees; 
    address[] public allPresales;    
    mapping(address => address[]) public presalesByCreator;

    // Optional: Param-Policies
    // uint256 public minSoftCapWei;    
    // uint256 public minDuration;      

    event PresaleCreated(address indexed creator, address presale, address token);
    event FeesWithdrawn(address indexed to, uint256 amount);
    event FeeReceived(address indexed presale, uint256 amount);
    event CreateFeePaid(address creator, uint256 createFeeWei);
    event CreateFeeUpdated(uint256 newFee);
    event PolicyUpdated(/* … */);

    constructor(uint16 _tokenFee, uint256 _createFeeWei) Ownable(msg.sender) {
        feeBps = _tokenFee;
        createFeeWei = _createFeeWei;
    }

    ///////////////////////
    // Receive Functions///
    ///////////////////////

    receive() external payable {
        emit FeeReceived(msg.sender, msg.value);
    }

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
    ) public payable returns (address presale) {
        // Fee
        require(msg.value >= createFeeWei, "create fee required");
        accuredCreateFees += createFeeWei;
        emit CreateFeePaid(msg.sender, createFeeWei);

        // refund overpay
        uint256 overpay = msg.value - createFeeWei;
        if (overpay > 0) {
            (bool refOk,) = msg.sender.call{value: overpay}("");
            require(refOk, "refund failed!");
        }

        if (_tokenAddress == address(0)) revert PresaleFactory__InvalidToken();
        if (_tokenSupplyInUnits == 0) revert PresaleFactory__InvalidSupply();
        if (_hardCapWei == 0) revert PresaleFactory__InvalidHardCap();
        if (_softCapWei == 0 || _softCapWei > _hardCapWei) revert PresaleFactory__InvalidSoftCap();
        if (_maxContribution != 0 && _minContribution > _maxContribution) {
            revert PresaleFactory__InvalidContributionRange();
        }
        if ( (_tokenSupplyInUnits * 1e18) / _hardCapWei == 0 ) revert PresaleFactory__PriceResolutionTooLow();

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

    function withdrawFees(address _to) public onlyOwner {
        if (address(this).balance == 0) revert PresaleFactory__NoFeesAvailable();
        uint256 feesToWithdraw = address(this).balance;
        (bool success, ) = payable(_to).call{value: address(this).balance}("");
        if (!success) {
            revert PresaleFactory__WithdrawFeesFailed();
        }
        emit FeesWithdrawn(owner(), feesToWithdraw);
    }

    function setCreateFee(uint256 _newFee) public onlyOwner {
        createFeeWei = _newFee;
        emit CreateFeeUpdated(_newFee);
    }

    /////////////////////////////////////
    // External View Functions///////////
    /////////////////////////////////////

    function getFeeBps() external view returns (uint256) {
        return feeBps;
    }

    function getCreationFee() external view returns (uint256) {
        return createFeeWei;
    }

    function getPresalesOfUser(address _user) external view returns (address[] memory) {
        return presalesByCreator[_user];
    }

    function getPresaleCountOfUser(address _user) external view returns (uint256) {
        return presalesByCreator[_user].length;
    }
    
}