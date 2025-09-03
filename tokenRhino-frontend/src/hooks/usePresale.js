// hooks/usePresale.js
import { useState, useEffect } from 'react';
import { request } from 'graphql-request';

const PRESALE_QUERY = `
  query GetPresale($id: ID!) {
  presale(id: $id) {
    id
    creator
    token
    tokensForSaleUnits
    tokensPerEth
    metadataCID
    raised
    finalized
    state
    softCap
    hardCap
    minContribution
    maxContribution
    startTime
    endTime
    createdAt
    tokenInfo {
      symbol
      decimals
      name
    }
  }
}
`;

export const usePresale = (presaleAddress) => {
  const [presale, setPresale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!presaleAddress) {
      setLoading(false);
      return;
    }

    const fetchPresale = async () => {
      try {
        setLoading(true);
        const data = await request(
          'https://api.studio.thegraph.com/query/119639/token-rhino-v-1/version/latest',
          PRESALE_QUERY,
          { id: presaleAddress.toLowerCase() }
        );
        setPresale(data.presale);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPresale();
  }, [presaleAddress]);

  return { presale, loading, error };
};