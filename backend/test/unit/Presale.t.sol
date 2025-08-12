//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {DeployMockERC20} from "../../script/DeployMockERC20.s.sol";
import {DeployPresale} from "../../script/DeployPresale.s.sol";
import {Presale} from "../../src/Presale.sol";
import {ERC20Mock} from "../../test/mocks/ERC20Mock.sol";

contract PresaleTest is Test {
    Presale presale;
    ERC20Mock token;

    uint256 private constant PRECISION = 1e18;
    uint256 private constant TOKEN_FEE = 250;
    uint256 private constant TOKEN_PER_ETH = 16e18;
    uint256 private constant INVESTMENT = 1 ether;

    address public USER = makeAddr("user");
    address public USER2 = makeAddr("user2");
    address public USER3 = makeAddr("user3");
    address public USER4 = makeAddr("user4");

    modifier tokensBought(address _user, uint256 _amount) {
        vm.startPrank(_user);
        presale.buyTokens{value: _amount}();
        vm.stopPrank();
        _;
    }

    function setUp() public {
        DeployPresale deployPresale = new DeployPresale();
        (presale, token) = deployPresale.run();

        vm.deal(USER, 30 ether);
        vm.deal(USER2, 30 ether);
        vm.deal(USER3, 30 ether);
        vm.deal(USER4, 30 ether);
    }

    ////////////////////////////////////
    // Buy Tests //////////////////////
    ////////////////////////////////////

    function testBuyTokens() public {
        vm.startPrank(USER2);
        presale.buyTokens{value: INVESTMENT}();
        vm.stopPrank();

        uint256 expectedTokens = (INVESTMENT * presale.getTokenPerETH()) /
            PRECISION; // assuming 16.000 tokens per ETH
        uint256 expectedFee = (INVESTMENT * TOKEN_FEE) / 10000;
        uint256 expectedContractBalance = INVESTMENT - expectedFee;
        console.log("Fee: ", expectedFee);

        console.log(
            "USER2 TOKEN BALANCE:",
            (presale.getUserBoughtTokens(USER2) / 1e18),
            "TRH"
        );
        assertEq(
            presale.getUserBoughtTokens(USER2),
            expectedTokens,
            "User should have 16_000 TRH tokens"
        );
        assertEq(
            expectedContractBalance,
            0.975 ether,
            "Presale contract should have 97,5% of the investment after fee"
        );
    }

    function testBuyTokensBelowMinContribution() public {
        vm.startPrank(USER2);
        vm.expectRevert(Presale.Presale__NotEnoughEthSent.selector);
        presale.buyTokens{value: 0.01 ether}();
        vm.stopPrank();
    }

    function testBuyTokensAboveMaxContribution() public {
        vm.startPrank(USER2);
        vm.expectRevert(
            abi.encodeWithSelector(
                Presale.Presale__MaxContributionExceeded.selector,
                USER2,
                INVESTMENT * 20,
                presale.i_maxContributionWei()
            )
        );
        presale.buyTokens{value: INVESTMENT * 20}();
        vm.stopPrank();
    }

    function testBuyTokensWithExceededContribution() public {
        vm.startPrank(USER2);
        presale.buyTokens{value: INVESTMENT}();
        vm.stopPrank();

        vm.startPrank(USER2);
        (uint256 totalWei, ) = presale.getUserContribution(USER2);
        uint256 attempted = totalWei += (INVESTMENT * 20);
        vm.expectRevert(
            abi.encodeWithSelector(
                Presale.Presale__MaxContributionExceeded.selector,
                USER2,
                attempted,
                presale.i_maxContributionWei()
            )
        );
        presale.buyTokens{value: INVESTMENT * 20}();
        vm.stopPrank();
    }

    function testGetTotalRaisedWei()
        public
        tokensBought(USER2, INVESTMENT)
        tokensBought(USER3, INVESTMENT)
    {
        uint256 totalRaised = presale.getTotalRaisedWei();
        assertEq(
            totalRaised,
            INVESTMENT * 2,
            "Total raised should match the investment amount"
        );
    }

    ////////////////////////////////////
    // Claim Tests /////////////////////
    ////////////////////////////////////

    function testClaimTokens()
        public
        tokensBought(USER2, INVESTMENT * 10)
        tokensBought(USER3, INVESTMENT * 10)
        tokensBought(USER4, INVESTMENT * 10)
    {
        skip(32 * 24 * 60 * 60);
        vm.startPrank(USER2);
        presale.claimTokens();
        vm.stopPrank();

        uint256 tokensPerEth = presale.getTokenPerETH(); 
        uint256 expectedTokens = (INVESTMENT * 10 * tokensPerEth) / PRECISION;

        uint256 userBalance = token.balanceOf(USER2);
        assertEq(
            userBalance,
            expectedTokens,
            "User should have claimed the correct amount of tokens"
        );
    }

    function testClaimTokensWhenNotFinalized()
        public
        tokensBought(USER2, INVESTMENT)
    {
        vm.startPrank(USER2);
        vm.expectRevert(Presale.Presale__NotFinalized.selector);
        presale.claimTokens();
        vm.stopPrank();
    }

    ////////////////////////////////////
    // View Only Tests /////////////////
    ////////////////////////////////////

    function testGetPresaleDetails() public view {
        (
            address tokenAddress,
            string memory tokenName,
            ,
            ,
            uint256 tokenSupplyInUnits,
            ,
            ,
            ,

        ) = presale.getPresaleDetails();

        assertEq(tokenAddress, address(token), "Token address should match");
        assertEq(tokenName, "TokenRhino", "Token name should match");
        assertEq(
            tokenSupplyInUnits,
            800_000 ether,
            "Token supply should match"
        );
    }
}
