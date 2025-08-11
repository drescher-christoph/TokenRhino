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
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {OracleLib} from "./libraries/OracleLib.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Presale is Ownable, ReentrancyGuard {
    ///////////////////
    // Errors //////////
    ///////////////////
    error Presale__PriceIsZero();
    error Presale__NoValueInMessage();
    error Presale__PresaleIsNotActive(PresaleState presaleState);
    error Presale__FeeTransferFailed();
    error Presale__NotEnoughEthSent();
    error Presale__MaxContributionExceeded(address user, uint256 contribution, uint256 maxContribution);

    ///////////////////
    // types //////////
    ///////////////////
    using OracleLib for AggregatorV3Interface;

    enum PresaleState {
        ACTIVE,
        ENDED,
        SOLD_OUT
    }

    ///////////////////
    // State Variables
    ///////////////////
    uint256 private constant PRECISION = 1e18;
    uint256 private constant TOKEN_FEE = 250;

    address public immutable i_factory;
    address public immutable ethUsdPriceFeed;
    IERC20 public immutable i_saleToken;
    uint256 public immutable i_startTime;
    uint256 public immutable i_endTime;
    uint256 public immutable i_tokensForSaleUnits;
    uint256 public immutable i_TOKENS_PER_ETH;
    uint256 public immutable i_maxContributionWei;
    uint256 public immutable i_minContributionWei;
    uint256 public immutable i_hardCapWei;
    uint256 public immutable i_softCapWei;

    string public s_tokenName;
    PresaleState public s_presaleState;
    uint256 public s_totalRaisedWei; //gross amount of wei raised in the presale
    uint256 public s_totalSold; // total amount of tokens sold
    mapping(address user => uint256 weiContributed) public s_contributedWei;
    mapping(address user => uint256 token) public s_purchased;

    ///////////////////
    // Events /////////
    ///////////////////
    event TokensBought(address indexed buyer, uint256 amount);

    ///////////////////
    // Modifier ///////
    ///////////////////
    modifier presaleIsActive() {
        if (s_presaleState != PresaleState.ACTIVE) {
            revert Presale__PresaleIsNotActive(s_presaleState);
        }
        _;
    }

    modifier sentEnoughEth() {
        if (msg.value < i_minContributionWei) {
            revert Presale__NotEnoughEthSent();
        }
        _;
    }

    modifier checkMaxContribution() {
        if (i_maxContributionWei > 0 && s_contributedWei[msg.sender] + msg.value > i_maxContributionWei) {
            revert Presale__MaxContributionExceeded(
                msg.sender,
                s_contributedWei[msg.sender] + msg.value,
                i_maxContributionWei
            );
        }
        _;
    }

    /**
     *
     * @param _owner the owner of the presale contract
     * @param _tokenAddress the address of the token that is being sold in the presale
     * @param _tokenName the name of the token that is being sold in the presale
     * @param _tokenSupplyInUnits total supply of the token in units (1e18 = 1 token) that is being sold in the presale
     * @param _hardCapWei the hard cap of the presale in wei (1 ETH = 1e18 wei)
     * @param _maxContribution the maximum amount of wei that can be contributed by a single address in the presale (1 ETH = 1e18 wei), can be set to 0 for no limit
     * @param _minContribution the minimum amount of wei that can be contributed by a single address in the presale (1 ETH = 1e18 wei), can be set to 0 for no limit
     */
    constructor(
        address _owner,
        address _tokenAddress,
        string memory _tokenName,
        uint256 _tokenSupplyInUnits,
        uint256 _maxContribution,
        uint256 _hardCapWei,
        uint256 _softCapWei,
        uint256 _minContribution
    ) Ownable(_owner) {
        require(_hardCapWei > 0);
        require(_tokenSupplyInUnits > 0);
        require(_softCapWei > 0 && _softCapWei <= _hardCapWei);

        i_saleToken = IERC20(_tokenAddress);
        i_tokensForSaleUnits = _tokenSupplyInUnits;
        s_tokenName = _tokenName;
        i_hardCapWei = _hardCapWei;
        i_softCapWei = _softCapWei;
        i_maxContributionWei = _maxContribution;
        i_minContributionWei = _minContribution;
        i_factory = msg.sender;

        i_startTime = block.timestamp;
        i_endTime = block.timestamp + 31 days;
        s_presaleState = PresaleState.ACTIVE;
        i_TOKENS_PER_ETH = (i_tokensForSaleUnits * PRECISION) / i_hardCapWei;
    }

    ///////////////////////
    // External Functions//
    ///////////////////////

    /**
     * @notice follows CEI (checks - effects - interactions) pattern
     * @notice this function lets users buy tokens in the presale by sending ETH on the contract
     */
    function buyTokens()
        external
        payable
        presaleIsActive
        sentEnoughEth
        checkMaxContribution
        nonReentrant
    {
        _updateStatus();
        uint256 tokenAmount = (msg.value * i_TOKENS_PER_ETH) / PRECISION;
        require(
            s_totalRaisedWei + msg.value <= i_hardCapWei,
            "Presale hard cap reached"
        );
        require(
            tokenAmount + s_totalSold < i_tokensForSaleUnits,
            "Presale sold out"
        );

        s_purchased[msg.sender] += tokenAmount;
        s_contributedWei[msg.sender] += msg.value;
        s_totalRaisedWei += msg.value;
        s_totalSold += tokenAmount;
        emit TokensBought(
            msg.sender,
            (msg.value * i_TOKENS_PER_ETH) / PRECISION
        );

        uint256 fee = (msg.value * TOKEN_FEE) / 10000;

        (bool success, ) = i_factory.call{value: fee}("");
        if (!success) {
            revert Presale__FeeTransferFailed();
        }
    }

    function claimTokens() external {}

    function withdrawFunds() external onlyOwner {}

    function refund() external {}

    /////////////////////////////////////
    // Internal Functions///////////////
    /////////////////////////////////////

    function _updateStatus() internal {
        if (s_presaleState == PresaleState.ACTIVE) {
            if (
                block.timestamp >= i_endTime ||
                s_totalSold >= i_tokensForSaleUnits
            ) {
                s_presaleState = PresaleState.ENDED;
            }
        }

        if (
            s_presaleState == PresaleState.ENDED &&
            s_totalRaisedWei < i_hardCapWei
        ) {
            s_presaleState = PresaleState.SOLD_OUT;
        }
    }

    /////////////////////////////////////
    // Internal View Functions//////////
    /////////////////////////////////////

    /////////////////////////////////////
    // Public & External View Functions//
    /////////////////////////////////////
}
