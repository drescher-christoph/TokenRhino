//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {DeployPresale} from "../../script/DeployPresale.s.sol";
import {DeployFactory} from "../../script/DeployFactory.s.sol";
import {DeployMockERC20} from "../../script/DeployMockERC20.s.sol";
import {Presale} from "../../src/Presale.sol";
import {PresaleFactory} from "../../src/PresaleFactory.sol";
import {ERC20Mock} from "../../test/mocks/ERC20Mock.sol";

contract PresaleFactoryTest is Test {

    PresaleFactory factory;
    Presale presale;
    ERC20Mock token;

    uint256 private constant PRECISION = 1e18;
    uint256 private constant TOKEN_FEE = 250;
    uint256 private constant TOKEN_PER_ETH = 16e18;
    uint256 private constant INVESTMENT = 1 ether;
    uint256 private constant CREATE_FEE = 0.01 ether;

    uint256 constant TOKENS_FOR_SALE = 800_000 ether;   
    uint256 constant HARD_CAP_WEI    = 50 ether;       
    uint256 constant SOFT_CAP_WEI    = 30 ether;        
    uint256 constant MIN_CONTRIB     = 0.05 ether;     
    uint256 constant MAX_CONTRIB     = 15 ether;   
    string constant METADATA_CID     = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";       

    address public FACTORY_OWNER = makeAddr("factory_owner");
    address public PRESALE_OWNER = makeAddr("presale_owner");
    address public USER2 = makeAddr("user2");
    address public USER3 = makeAddr("user3");
    address public USER4 = makeAddr("user4");


    function setUp() public {
        vm.startPrank(FACTORY_OWNER);
        DeployFactory factoryDeployer = new DeployFactory();
        factory = factoryDeployer.runLocal();
        vm.stopPrank();

        vm.deal(PRESALE_OWNER, 30 ether);
        vm.deal(USER2, 30 ether);
        vm.deal(USER3, 30 ether);
        vm.deal(USER4, 30 ether);

        console.log("TEST SET UP AND READY!");
    }

    ////////////////////////////////////
    // Constructor Tests ///////////////
    ////////////////////////////////////

    function testFeeBpsSetCorrectly() public {
        factory = new PresaleFactory(150, 0.01 ether);
        assertEq(factory.getFeeBps(), 150, "FeeBps does not match");
    }

    ////////////////////////////////////
    // Create Presale Tests ////////////
    ////////////////////////////////////

    function testCreatePresale() public {
        vm.startPrank(PRESALE_OWNER);
        DeployMockERC20 erc20Deployer = new DeployMockERC20();
        token = erc20Deployer.runLocal();

        address presaleAddress = factory.createPresale{value: CREATE_FEE}(
            address(token),
            "TokenRhino",
            TOKENS_FOR_SALE,
            HARD_CAP_WEI,
            SOFT_CAP_WEI,
            MIN_CONTRIB,
            MAX_CONTRIB,
            METADATA_CID
        );
        presale = Presale(presaleAddress);

        uint256 expectedUserPresaleCount = 1;
        uint256 actualUserPresaleCount = factory.getPresaleCountOfUser(PRESALE_OWNER);

        assertEq(expectedUserPresaleCount, actualUserPresaleCount, "User Presale count doesn't match!");

        address createdPresaleAddress = factory.getPresalesOfUser(PRESALE_OWNER)[0];
        assertEq(createdPresaleAddress, presaleAddress, "Presale address doens't match!");
    }

    ////////////////////////////////////
    // Fees Tests /////////////////////
    ////////////////////////////////////

    function testCheckFees() public {

        // Create and fund presale
        vm.startPrank(PRESALE_OWNER);
        DeployMockERC20 erc20Deployer = new DeployMockERC20();
        token = erc20Deployer.runLocal();

        address presaleAddress = factory.createPresale{value: CREATE_FEE}(
            address(token),
            "TokenRhino",
            TOKENS_FOR_SALE,
            HARD_CAP_WEI,
            SOFT_CAP_WEI,
            MIN_CONTRIB,
            MAX_CONTRIB,
            METADATA_CID
        );
        presale = Presale(presaleAddress);

        token.transfer(presaleAddress, TOKENS_FOR_SALE);
        vm.stopPrank();

        // For now it should be zero, however this will change once the createPresale method is payable and requires a payment of 0.01ETH
        uint256 factoryBalanceBeforeInvestment = address(factory).balance;

        // Users Invest
        vm.startPrank(USER2);
        presale.buyTokens{value: INVESTMENT}();
        vm.stopPrank();

        vm.startPrank(USER3);
        presale.buyTokens{value: INVESTMENT}();
        vm.stopPrank();

        // Check factory balance
        uint256 factoryBalanceAfterInvestment = address(factory).balance;

        console.log("Factory Balance before: ", factoryBalanceBeforeInvestment);
        console.log("Factory Balance after: ", factoryBalanceAfterInvestment);

        assertLt(factoryBalanceBeforeInvestment, factoryBalanceAfterInvestment);

        uint256 expectedFees = ((INVESTMENT * TOKEN_FEE) / 10_000) * 2;
        console.log("Expected Fees: ", expectedFees);

        assertEq(expectedFees + CREATE_FEE, factoryBalanceAfterInvestment);
    }

    function testWithdrawFees() public {

        // Create and fund presale
        vm.startPrank(PRESALE_OWNER);
        DeployMockERC20 erc20Deployer = new DeployMockERC20();
        token = erc20Deployer.runLocal();

        address presaleAddress = factory.createPresale{value: CREATE_FEE}(
            address(token),
            "TokenRhino",
            TOKENS_FOR_SALE,
            HARD_CAP_WEI,
            SOFT_CAP_WEI,
            MIN_CONTRIB,
            MAX_CONTRIB,
            METADATA_CID
        );
        presale = Presale(presaleAddress);

        token.transfer(presaleAddress, TOKENS_FOR_SALE);
        vm.stopPrank();

        // Users Invest
        vm.startPrank(USER2);
        presale.buyTokens{value: INVESTMENT}();
        vm.stopPrank();

        vm.startPrank(USER3);
        presale.buyTokens{value: INVESTMENT}();
        vm.stopPrank();

        // Check factory balance
        uint256 factoryBalanceAfterInvestment = address(factory).balance;
        uint256 expectedFactoryFeeBalance = CREATE_FEE + (((INVESTMENT * TOKEN_FEE) / 10_000) * 2);

        assertEq(expectedFactoryFeeBalance, factoryBalanceAfterInvestment, "Actual fee balance does not match the expected balance");

        // Withdraw Fee
        uint256 factoryOwnerBalanceBeforePayout = address(FACTORY_OWNER).balance;
        vm.startPrank(factory.owner());
        factory.withdrawFees(FACTORY_OWNER);
        vm.stopPrank();
        uint256 factoryOwnerBalanceAfterPayout = address(FACTORY_OWNER).balance;

        console.log("Factory fees to withdraw: ", factoryBalanceAfterInvestment);
        console.log("Factory Owner Balance before fee payout: ", factoryOwnerBalanceBeforePayout);
        console.log("Factory Owner Balance after fee payout: ", factoryOwnerBalanceAfterPayout);

        assertEq(factoryOwnerBalanceBeforePayout + factoryBalanceAfterInvestment, factoryOwnerBalanceAfterPayout);
        assertEq(expectedFactoryFeeBalance, address(FACTORY_OWNER).balance);
    }

    function testUpdateCreateFees() public {
        console.log("Factory owner: ", factory.owner());
        vm.startPrank(factory.owner());
        factory.setCreateFee(150);
        vm.stopPrank();

        assertEq(factory.getCreationFee(), 150);
    }

}
