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
