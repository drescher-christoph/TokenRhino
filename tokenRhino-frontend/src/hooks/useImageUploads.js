// hooks/useImageUpload.js
import { useState } from 'react';
import { uploadToPinata } from '../services/ipfsService';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file, options = {}) => {
    setUploading(true);
    setError(null);
    
    try {
      // Validierung
      if (!file.type.startsWith('image/')) {
        throw new Error('Datei muss ein Bild sein');
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('Datei ist zu groß (max. 10MB)');
      }

      const result = await uploadToPinata(file, {
        name: options.name || file.name
      });
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
}