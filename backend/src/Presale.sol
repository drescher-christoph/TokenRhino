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
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
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
    error Presale__MaxContributionExceeded(
        address user,
        uint256 contribution,
        uint256 maxContribution
    );
    error Presale__NotFinalized();
    error Presale__NoTokensToClaim();
    error Presale__NotExpectedState(PresaleState expected, PresaleState actual);
    error Presale__CLAIMING_FAILED();
    error Presale__NoFundsToWithdraw();
    error Presale__WithdrawFailed();

    enum PresaleState {
        ACTIVE,
        CLAIMABLE,
        REFUNDABLE
    }

    ///////////////////
    // Types /////////
    ///////////////////

    using SafeERC20 for IERC20;

    ///////////////////
    // State Variables
    ///////////////////
    uint256 private constant PRECISION = 1e18;

    address public immutable i_factory;
    uint16 private immutable i_fee;

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

    bool public s_finalized;
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
    event TokensClaimed(address indexed user, uint256 amount);

    ///////////////////
    // Modifier ///////
    ///////////////////
    modifier presaleIsActive() {
        if (s_presaleState != PresaleState.ACTIVE) {
            revert Presale__PresaleIsNotActive(s_presaleState);
        }
        _;
    }

    modifier checkContributionLimits() {
        if (msg.value < i_minContributionWei) {
            revert Presale__NotEnoughEthSent();
        }
        if (
            i_maxContributionWei > 0 &&
            s_contributedWei[msg.sender] + msg.value > i_maxContributionWei
        ) {
            revert Presale__MaxContributionExceeded(
                msg.sender,
                s_contributedWei[msg.sender] + msg.value,
                i_maxContributionWei
            );
        }
        _;
    }

    modifier isFinalized(bool _finalized) {
        _updateStatus();
        if (s_finalized != _finalized) {
            revert Presale__NotFinalized();
        }
        _;
    }

    modifier checkedState(PresaleState _state) {
        _updateStatus();
        if (s_presaleState != _state) {
            revert Presale__NotExpectedState(_state, s_presaleState);
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
        uint16 _tokenFee,
        address _tokenAddress,
        string memory _tokenName,
        uint256 _tokenSupplyInUnits,
        uint256 _hardCapWei,
        uint256 _softCapWei,
        uint256 _minContribution,
        uint256 _maxContribution
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
        i_fee = _tokenFee;

        i_startTime = block.timestamp;
        i_endTime = block.timestamp + 31 days;
        i_TOKENS_PER_ETH = (i_tokensForSaleUnits * PRECISION) / i_hardCapWei;

        s_presaleState = PresaleState.ACTIVE;
        s_finalized = false;
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
        checkContributionLimits
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

        uint256 fee = (msg.value * i_fee) / 10000;

        (bool success, ) = i_factory.call{value: fee}("");
        if (!success) {
            revert Presale__FeeTransferFailed();
        }
    }

    /**
     * @notice follow CEI (checks - effects - interactions) pattern
     * @notice allows user to claim his bought tokens
     */
    function claimTokens()
        external
        isFinalized(true)
        checkedState(PresaleState.CLAIMABLE)
        nonReentrant
    {
        if (s_purchased[msg.sender] == 0) {
            revert Presale__NoTokensToClaim();
        }
        uint256 userTokens = s_purchased[msg.sender];
        require(
            i_saleToken.balanceOf(address(this)) >= userTokens,
            "insufficient escrow"
        );
        s_purchased[msg.sender] = 0;

        // bool success = i_saleToken.transfer(msg.sender, userTokens);
        // if (!success) {
        //     revert Presale__CLAIMING_FAILED();
        // }
        i_saleToken.safeTransfer(msg.sender, userTokens);

        emit TokensClaimed(msg.sender, userTokens);
    }

    function withdrawFunds()
        external
        onlyOwner
        isFinalized(true)
        checkedState(PresaleState.CLAIMABLE)
        nonReentrant
    {
        uint256 fundsToWithdraw = address(this).balance;
        if (fundsToWithdraw == 0) {
            revert Presale__NoFundsToWithdraw();
        }
        (bool success, ) = payable(owner()).call{value: fundsToWithdraw}("");
        if (!success) {
            revert Presale__WithdrawFailed();
        }
    }

    function refund() external checkedState(PresaleState.REFUNDABLE) {
        
    }

    /////////////////////////////////////
    // Internal Functions///////////////
    /////////////////////////////////////

    function _updateStatus() internal {
        if (s_finalized) return;

        if (
            s_totalSold >= i_tokensForSaleUnits ||
            s_totalRaisedWei >= i_hardCapWei
        ) {
            s_finalized = true;
            s_presaleState = PresaleState.CLAIMABLE;
            return;
        }

        // Normales Ende: Zeit vorbei -> Erfolg wenn SoftCap erreicht, sonst Refund
        if (block.timestamp >= i_endTime) {
            s_finalized = true;
            if (s_totalRaisedWei >= i_softCapWei) {
                s_presaleState = PresaleState.CLAIMABLE;
            } else {
                s_presaleState = PresaleState.REFUNDABLE;
            }
        }
    }

    /////////////////////////////////////
    // Internal View Functions//////////
    /////////////////////////////////////

    /////////////////////////////////////
    // Public & External View Functions//
    /////////////////////////////////////

    function getPresaleState() external view returns (PresaleState) {
        return s_presaleState;
    }

    function getPresaleDetails()
        external
        view
        returns (
            address,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            PresaleState
        )
    {
        return (
            address(i_saleToken),
            s_tokenName,
            i_startTime,
            i_endTime,
            i_tokensForSaleUnits,
            i_TOKENS_PER_ETH,
            s_totalRaisedWei,
            s_totalSold,
            s_presaleState
        );
    }

    function getUserContribution(
        address user
    ) external view returns (uint256 weiContributed, uint256 tokensPurchased) {
        return (s_contributedWei[user], s_purchased[user]);
    }

    function getUserBoughtTokens(address user) external view returns (uint256) {
        return s_purchased[user];
    }

    function getTokenPerETH() external view returns (uint256) {
        return i_TOKENS_PER_ETH;
    }

    function getTotalRaisedWei() external view returns (uint256) {
        return s_totalRaisedWei;
    }
}
