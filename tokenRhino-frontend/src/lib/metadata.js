// utils/metadata.js
export function createPresaleMetadata(token, cfg) {
  return {
    name: token.name,
    symbol: token.symbol,
    description: token.description || "",
    image: token.logoGatewayUrl || token.logoUrl || "",
    external_url: token.website || "",
    socials: {
      twitter: token.twitter || "",
      telegram: token.telegram || "",
      discord: token.discord || "",
      website: token.website || ""
    },
    presale: {
      tokenAddress: token.tokenAddress,
      tokensForSale: token.tokensForSale,
      hardCap: cfg.hardCap,
      softCap: cfg.softCap,
      minContribution: cfg.minContrib,
      maxContribution: cfg.maxContrib,
      startTime: cfg.start,
      endTime: cfg.end
    },
    version: "1.0.0",
    createdAt: new Date().toISOString()
  };
}