import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

const url =
  "https://api.studio.thegraph.com/query/119639/token-rhino-v-1/version/latest";
const token = "0f97fc83b69126dfea153b765e88f5f6";

// --- Dein GraphQL Query ---
const PRESALES_QUERY = gql`
  {
    presales(first: 50, orderBy: createdAt, orderDirection: desc) {
      id
      creator
      token
      tokensForSaleUnits
      tokensPerEth
      raised
      softCap
      hardCap
      state
      startTime
      endTime
      minContribution
      maxContribution
      metadataCID
      createdAt
      createdAtBlock
      tokenInfo {
        name
        symbol
        decimals
      }
      factoryEvent {
        blockNumber
        blockTimestamp
      }
    }
  }
`;

// --- React Query Hook ---
export function usePresales() {
  return useQuery({
    queryKey: ["presales"],
    queryFn: async () => {
      const res = await request(
        url,
        PRESALES_QUERY,
        {},
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );
      return res.presales;
    },
    staleTime: 60 * 100,
  });
}
