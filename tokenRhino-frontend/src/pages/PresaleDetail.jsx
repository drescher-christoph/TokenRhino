import { useParams, useLocation, Link } from "react-router-dom";
import { usePresale } from "../hooks/usePresale";
import { usePresaleMetadata } from "../hooks/usePresaleMetadata";
import { use, useEffect, useState } from "react";
import { PresaleAbi } from "../abi/Presale";
import { erc20Abi } from "viem";
import { formatUnixTime } from "../lib/time";
import { ethers } from "ethers";
import {
  useBalance,
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  ExternalLink,
  Twitter,
  MessageCircle,
  Globe,
  Clock,
  Users,
  Lock,
  TrendingUp,
} from "lucide-react";

const PresaleDetail = () => {
  const [ethAmount, setEthAmount] = useState("");
  const [raisedDirect, setRaisedDirect] = useState(null);

  const account = useAccount();
  const {
    data: balance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useBalance({
    address: account.address,
    watch: true,
  });
  const walletIsConnected = account.isConnected;

  const { address } = useParams(); // Holt :address aus der URL
  const location = useLocation();
  const { presale, loading, error } = usePresale(address);
  const {
    metadata,
    loading: metadataLoading,
    error: metadataError,
  } = usePresaleMetadata(presale?.metadataCID, presale?.token);

  const { data: contributedWei } = useReadContract({
    address: presale?.id,
    abi: PresaleAbi,
    functionName: "s_contributedWei",
    args: [account.address],
    watch: true,
    enabled: !!presale?.id && !!account?.address,
  });

  const { data: purchasedTokens } = useReadContract({
    address: presale?.id,
    abi: PresaleAbi,
    functionName: "s_purchased",
    args: [account.address],
    watch: true,
    enabled: !!presale?.id && !!account?.address,
  });

  const { data: presaleState } = useReadContract({
    address: presale?.id,
    abi: PresaleAbi,
    functionName: "s_presaleState",
    watch: true,
    enabled: !!presale?.id && !!account?.address,
  });

  const { data: presaleFinalized } = useReadContract({
    address: presale?.id,
    abi: PresaleAbi,
    functionName: "s_finalized",
    watch: true,
    enabled: !!presale?.id && !!account?.address,
  });

  const { data: totalSaleSupply } = useReadContract({
    address: presale?.id,
    abi: PresaleAbi,
    functionName: "i_tokensForSaleUnits",
    watch: false,
    enabled: !!presale?.id && !!account?.address,
  });

  const { data: totalTokensSold } = useReadContract({
    address: presale?.id,
    abi: PresaleAbi,
    functionName: "s_totalSold",
    watch: true,
    enabled: !!presale?.id && !!account?.address,
  });

  const { data: tokenBalanceOfPresale } = useReadContract({
    address: presale?.token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [presale?.id],
  });

  const quickAmounts = ["Min", "0.1", "1", "5", "Max"];
  const presaleStates = ["Active", "Claimable", "Refundable"];

  // wagmi: write + receipt
  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: waiting,
    isSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: !!txHash },
  });

  useEffect(() => {
    async function fetchRaised() {
      if (!presale?.id || !account?.address) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(presale.id, PresaleAbi, provider);
        const raised = await contract.s_totalRaisedWei();
        setRaisedDirect(raised);
        console.log("Direct from contract:", raised.toString());
      } catch (err) {
        console.error("Error fetching raised from contract:", err);
      }
    }
    fetchRaised();
  }, [presale?.id, account?.address]);

  function formatCompactNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "k";
    return num.toFixed(2);
  }

  if (loading || metadataLoading) {
    return <div className="text-center text-white">Loading presale...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  if (metadataError) {
    console.error("Metadata error:", metadataError);
  }

  console.log("Presale data:", presale);
  //   console.log("Metadata:", metadata);
  //   console.log("Wallet Balance:", balance);

  const calculateTokens = (eth) => {
    const ethValue = Number.parseFloat(eth) || 0;
    return (
      ethValue * Number.parseFloat(presale.tokensPerEth)
    ).toLocaleString();
  };

  const progressPercentage =
    (Number.parseFloat(raisedDirect) / Number.parseFloat(presale.hardCap)) *
    100;

  const handleQuickAmount = (amount) => {
    switch (amount) {
      case "Min":
        setEthAmount(ethers.formatUnits(presale.minContribution, 18));
        break;

      case "Max": {
        const tokensLeft = totalSaleSupply - totalTokensSold;
        const remainingEth = Number(tokensLeft) / Number(presale.tokensPerEth);

        if (presale.maxContribution !== "0") {
          const maxEth = Number(
            ethers.formatUnits(presale.maxContribution, 18)
          );

          const investable = Math.min(remainingEth, maxEth);
          setEthAmount(String(investable));
        } else {
          setEthAmount(String(remainingEth));
        }
        break;
      }

      default:
        setEthAmount(amount);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  function formatCompactNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "k";
    return num.toFixed(2);
  }

  const handleBuyTokens = () => {
    if (!walletIsConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    const ethValue = ethers.parseEther(ethAmount || "0");
    try {
      writeContract({
        address: presale.id,
        abi: PresaleAbi,
        functionName: "buyTokens",
        value: ethValue,
      });
    } catch (err) {
      console.error("Error buying tokens:", err);
    }
  };

  const handleClaimTokens = () => {
    if (!walletIsConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      writeContract({
        address: presale.id,
        abi: PresaleAbi,
        functionName: "claimTokens",
      });
    } catch (err) {
      console.error("Error claiming tokens:", err);
    }
  };

  const handleWithdrawFunds = () => {
    if (!walletIsConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      writeContract({
        address: presale.id,
        abi: PresaleAbi,
        functionName: "withdrawFunds",
      });
    } catch (err) {
      console.error("Error withdrawing funds:", err);
    }
  };

  const handleFundPresale = async () => {
    if (!walletIsConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Token Contract Adresse aus presaleData
      const tokenAddress = presale?.token;
      const tokenDecimals = presale?.tokenInfo?.decimals ?? 18;
      const presaleAddress = presale?.id;

      console.log("token Address:", tokenAddress);
      console.log("Token Decimals:", tokenDecimals);
      console.log("Presale Address:", presaleAddress);

      if (!tokenAddress || !presaleAddress) {
        throw new Error("Token or Presale Address missing!");
      }

      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

      // Menge berechnen (z. B. Hardcap oder vorher gespeicherte Amounts)
      const fundAmount = ethers.parseUnits(
        presale?.tokensForSaleUnits?.toString() || "0",
        tokenDecimals
      );
      console.log("Funding Amount (in smallest units):", fundAmount.toString());

      // Transfer starten
      const tx = await tokenContract.transfer(presaleAddress, fundAmount);
      await tx.wait();
    } catch (err) {
      alert("There was a problem funding your presale: ", err.message);
    }
  };

  console.log("Presale Metadara:", metadata);

  return (
    <div className="min-h-screen bg-[#0F1117] mt-21 sm:mt-21 md:mt-0 lg:mt-0 xl:mt-0 sm-0 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <Card className="mb-6 bg-[#161B22] border border-[#23272F]">
          <CardContent className="px-6 py-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-[#1A1F29] border border-[#23272F]" />
                  {metadata && (
                    <img
                      src={metadata.image}
                      alt="Token Logo"
                      className="absolute inset-0 w-32 h-32 rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white">
                      {presale.tokenInfo.name}
                    </h1>
                    <Badge
                      variant="secondary"
                      className="bg-[#23272F] text-white"
                    >
                      {presale.tokenInfo.symbol}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-green-400 text-green-400 bg-green-400/10"
                    >
                      {presaleStates[presaleState]}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-pretty">
                    {metadata.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#23272F] text-gray-400 hover:bg-[#858a94] bg-[#0F1117]"
                  onClick={() =>
                    window.open(metadata.socials.twitter, "_blank")
                  }
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#23272F] text-gray-400 hover:bg-[#858a94] bg-[#0F1117]"
                  onClick={() =>
                    window.open(metadata.socials.telegram, "_blank")
                  }
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#23272F] text-gray-400 hover:bg-[#858a94] bg-[#0F1117]"
                  onClick={() =>
                    window.open(metadata.socials.website, "_blank")
                  }
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-3">
          {/* Left Column - Token Information */}
          <div className="space-y-6 lg:col-span-2">
            {/* Presale Info Card */}
            <Card className="bg-[#161B22] border border-[#23272F]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5" />
                  Presale Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Price</p>
                    <p className="text-lg font-semibold text-white">
                      1 ETH ={" "}
                      {formatCompactNumber(Number(presale.tokensPerEth))}{" "}
                      {presale.tokenInfo.symbol}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Status</p>
                    <Badge className="bg-green-400/10 text-green-400 border-green-400">
                      {presaleStates[presaleState]}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Raised</span>
                    <span className="font-medium text-white">
                      {raisedDirect ? ethers.formatUnits(raisedDirect) : 0} /{" "}
                      {ethers.formatUnits(presale.hardCap)} ETH
                    </span>
                  </div>
                  <div className="w-full bg-[#1A1D24] rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>
                      Softcap: {ethers.formatUnits(presale.softCap)} ETH
                    </span>
                    <span>{progressPercentage.toFixed(1)}% Complete</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Min Contribution</p>
                    <p className="font-semibold text-white">
                      {ethers.formatUnits(presale.minContribution)} ETH
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Max Contribution</p>
                    <p className="font-semibold text-white">
                      {ethers.formatUnits(presale.maxContribution)} ETH
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Start Time
                    </p>
                    <p className="font-semibold text-white">
                      {formatUnixTime(presale.startTime)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      End Time
                    </p>
                    <p className="font-semibold text-white">
                      {formatUnixTime(presale.endTime)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Token Description */}
            <Card className="bg-[#161B22] border border-[#23272F]">
              <CardHeader>
                <CardTitle className="text-white">
                  About {presale.tokenInfo.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-400">
                  <p className="text-pretty">{metadata.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contract Address */}
            <Card className="bg-[#161B22] border border-[#23272F]">
              <CardHeader>
                <CardTitle className="text-white">
                  Contract Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg bg-[#1A1F29] p-3">
                  <code className="text-sm font-mono text-gray-400">
                    {presale.id}
                  </code>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:bg-[#23272F]"
                      onClick={() => copyToClipboard(presale.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:bg-[#23272F]"
                      onClick={() =>
                        window.open(
                          `https://sepolia.etherscan.io/address/${presale.id}`,
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Invest Box */}
          <div className="space-y-6">
            <Card className="sticky top-6 bg-[#161B22] border border-[#23272F]">
              <CardHeader>
                <CardTitle className="text-white">
                  {tokenBalanceOfPresale == 0 && !presaleFinalized
                    ? "Not funded yet"
                    : presaleFinalized &&
                        account.address.toLowerCase() === presale.creator
                      ? "Withdraw Funds"
                      : presaleFinalized
                        ? "Claim Tokens"
                        : "Join Presale"}
                </CardTitle>
                <p className="text-sm text-gray-400">
                  {tokenBalanceOfPresale == 0 && !presaleFinalized
                    ? "No investments available until the presale is funded"
                    : presaleFinalized &&
                        account.address.toLowerCase() === presale.creator
                      ? `Your presale was successful! Withdraw the raised ETH to your wallet.`
                      : presaleFinalized
                        ? `Invested: ${contributedWei ? ethers.formatEther(contributedWei) : "0"} ETH`
                        : `Balance: ${balance ? ethers.formatUnits(balance.value).slice(0, 4) : 0} ETH`}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {tokenBalanceOfPresale == 0 ? (
                  ""
                ) : !presaleFinalized ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Amount in ETH
                      </label>
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={ethAmount}
                        onChange={(e) => setEthAmount(e.target.value)}
                        className="text-lg bg-[#151821] border border-[#23272F] text-white"
                      />
                    </div>

                    <div className="flex gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-[#23272F] bg-[#151821] text-gray-400 hover:bg-[#23272F]"
                          onClick={() => handleQuickAmount(amount)}
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  ""
                )}

                <Separator className="bg-[#23272F]" />

                <div className="space-y-2">
                  <p className="text-sm text-gray-400">
                    {presaleFinalized &&
                    account.address.toLowerCase() === presale.creator
                      ? "Funds available"
                      : tokenBalanceOfPresale == 0 &&
                          account.address.toLowerCase() === presale.creator
                        ? "You have to fund"
                        : tokenBalanceOfPresale == 0
                          ? ""
                          : presaleFinalized
                            ? "Claimable"
                            : "You get"}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {tokenBalanceOfPresale == 0 &&
                    account.address.toLowerCase() === presale.creator
                      ? `${formatCompactNumber(Number(presale.tokensForSaleUnits))} ${presale.tokenInfo.symbol}`
                      : presaleFinalized &&
                          account.address.toLowerCase() === presale.creator
                        ? `${raisedDirect ? ethers.formatUnits(raisedDirect) : "0"} ETH`
                        : presaleFinalized
                          ? `${formatCompactNumber(Number(purchasedTokens))} ${presale.tokenInfo.symbol}`
                          : `${calculateTokens(ethAmount)} ${presale.tokenInfo.symbol}`}
                  </p>
                </div>

                <Button
                  className="w-full bg-[#00E3A5] hover:bg-[#00C2FF] text-white"
                  size="lg"
                  onClick={
                    tokenBalanceOfPresale == 0 && account.address.toLowerCase() === presale.creator ?
                    handleFundPresale :
                    presaleFinalized &&
                    account.address.toLowerCase() === presale.creator
                      ? handleWithdrawFunds
                      : presaleFinalized
                        ? handleClaimTokens
                        : handleBuyTokens
                  }
                >
                  {tokenBalanceOfPresale == 0
                    ? "Fund now"
                    : presaleFinalized
                      ? "Claim now"
                      : isPending
                        ? "Processing..."
                        : waiting
                          ? "Confirming..."
                          : "Join Presale"}
                </Button>

                <div className="space-y-1 text-xs text-gray-400">
                  <p>• Network fee not included</p>
                  <p>• DYOR – TokenRhino does not endorse this project</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Additional Info */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Vesting Schedule */}
          <Card className="bg-[#161B22] border border-[#23272F]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lock className="h-5 w-5" />
                Vesting Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">
                    TGE (Token Generation Event)
                  </span>
                  <span className="text-sm font-medium text-white">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Month 1</span>
                  <span className="text-sm font-medium text-white">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Month 2</span>
                  <span className="text-sm font-medium text-white">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Month 3</span>
                  <span className="text-sm font-medium text-white">25%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liquidity Lock */}
          <Card className="bg-[#161B22] border border-[#23272F]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lock className="h-5 w-5" />
                Liquidity Lock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Lock Duration</span>
                  <span className="text-sm font-medium text-white">
                    12 months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Locked Amount</span>
                  <span className="text-sm font-medium text-white">80%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Lock Provider</span>
                  <span className="text-sm font-medium text-white">
                    Unicrypt
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tokenomics */}
          <Card className="bg-[#161B22] border border-[#23272F]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5" />
                Tokenomics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Total Supply</span>
                  <span className="text-sm font-medium text-white">
                    1,000,000,000
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Presale</span>
                  <span className="text-sm font-medium text-white">40%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Liquidity</span>
                  <span className="text-sm font-medium text-white">30%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Team</span>
                  <span className="text-sm font-medium text-white">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Marketing</span>
                  <span className="text-sm font-medium text-white">10%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PresaleDetail;
