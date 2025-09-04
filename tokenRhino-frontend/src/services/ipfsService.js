// services/ipfsService.js
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET = import.meta.env.VITE_PINATA_SECRET;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT_TOKEN;

export async function uploadToPinata(file, options = {}) {

  const formData = new FormData();
  formData.append("file", file);

  // Optional: Metadata hinzufügen
  if (options.name) {
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: options.name,
      })
    );
  }

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Pinata API Error:", errorData);

    // Bessere Fehlermeldung
    let errorMessage = "Upload zu Pinata fehlgeschlagen";
    if (errorData.error) {
      errorMessage += `: ${errorData.error}`;
    } else if (errorData.message) {
      errorMessage += `: ${errorData.message}`;
    } else {
      errorMessage += `: Status ${res.status} ${res.statusText}`;
    }

    throw new Error(errorMessage);
  }

  const data = await res.json();
  return {
    ipfsHash: data.IpfsHash,
    ipfsUrl: `ipfs://${data.IpfsHash}`,
    gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
  };
}

export function getIPFSUrl(ipfsHashOrUrl) {
  if (!ipfsHashOrUrl) return "";
  
  // Falls es ein Hash ohne Prefix ist (z.B. "Qm...")
  if (ipfsHashOrUrl.startsWith('Qm') && ipfsHashOrUrl.length === 46) {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHashOrUrl}`;
  }
  
  // Falls es eine ipfs:// URL ist
  if (ipfsHashOrUrl.startsWith("ipfs://")) {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHashOrUrl.substring(7)}`;
  }
  
  // Falls es bereits eine HTTP URL ist
  if (ipfsHashOrUrl.startsWith("http")) {
    return ipfsHashOrUrl;
  }
  
  return ipfsHashOrUrl;
}

export async function uploadJsonToPinata(jsonData, options = {}) {
  // Token Validierung
  if (!PINATA_JWT) {
    throw new Error('VITE_PINATA_JWT_TOKEN ist nicht gesetzt');
  }

  try {
    console.log('📤 Uploading JSON to Pinata...');
    
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PINATA_JWT}`
      },
      body: JSON.stringify({
        pinataMetadata: {
          name: options.name || "presale-metadata.json"
        },
        pinataContent: jsonData
      }),
    });

    console.log('📨 Pinata JSON Response:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `JSON Upload fehlgeschlagen: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ JSON Upload erfolgreich! Hash:', data.IpfsHash);
    
    return {
      ipfsHash: data.IpfsHash,
      ipfsUrl: `ipfs://${data.IpfsHash}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
    };

  } catch (error) {
    console.error('💥 JSON Upload Error:', error);
    throw error;
  }
}

export async function fetchPresaleMetadata(ipfsHashOrUrl) {
  try {
    console.log('📥 Fetching metadata for:', ipfsHashOrUrl);
    
    let url;
    
    if (ipfsHashOrUrl.startsWith('ipfs://')) {
      url = `https://gateway.pinata.cloud/ipfs/${ipfsHashOrUrl.substring(7)}`;
    } else if (ipfsHashOrUrl.startsWith('Qm') && ipfsHashOrUrl.length === 46) {
      url = `https://gateway.pinata.cloud/ipfs/${ipfsHashOrUrl}`;
    } else if (ipfsHashOrUrl.startsWith('http')) {
      url = ipfsHashOrUrl;
    } else {
      throw new Error('Ungültiger IPFS Hash oder URL');
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Metadata nicht gefunden: ${response.status}`);
    }

    const metadata = await response.json();
    console.log('✅ Metadata erfolgreich geladen');
    
    return metadata;
    
  } catch (error) {
    console.error('❌ Fehler beim Laden der Metadata:', error);
    throw new Error(`Konnte Metadata nicht laden: ${error.message}`);
  }
}

export function getFallbackMetadata(presaleAddress) {
  return {
    name: `Presale ${presaleAddress.slice(0, 8)}`,
    symbol: 'TKN',
    description: 'Token Presale',
    image: '/placeholder-token.png',
    socials: {
      twitter: '',
      telegram: '',
      discord: '',
      website: ''
    }
  };
}
