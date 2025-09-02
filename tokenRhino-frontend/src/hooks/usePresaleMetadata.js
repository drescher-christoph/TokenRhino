// hooks/usePresaleMetadata.js
import { useState, useEffect } from 'react';
import { fetchPresaleMetadata, getFallbackMetadata } from '../services/ipfsService';

export function usePresaleMetadata(metadataCID, presaleAddress) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetadata = async () => {
      if (!metadataCID) {
        setMetadata(getFallbackMetadata(presaleAddress));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchPresaleMetadata(metadataCID);
        setMetadata(data);
        
      } catch (err) {
        console.error('Failed to load metadata:', err);
        setError(err.message);
        setMetadata(getFallbackMetadata(presaleAddress));
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, [metadataCID, presaleAddress]);

  return { metadata, loading, error };
}