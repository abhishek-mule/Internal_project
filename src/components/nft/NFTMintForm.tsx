import React, { useState } from 'react';
import { useContract } from '../../context/ContractContext';
import { useAuth } from '../../context/AuthContext';
import { NFTMetadata } from '../../types';
import { Upload, Loader2 } from 'lucide-react';

interface NFTMintFormProps {
  cropId: string;
  cropName: string;
  onSuccess: () => void;
}

export const NFTMintForm: React.FC<NFTMintFormProps> = ({
  cropId,
  cropName,
  onSuccess,
}) => {
  const { mintProduct } = useContract();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    temperature: '',
    humidity: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Convert image to base64 for IPFS storage
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const metadata: NFTMetadata = {
          name: cropName,
          description: formData.description,
          image: base64Image,
          properties: {
            cropId,
            timestamp: Date.now(),
            location: formData.location,
            temperature: parseFloat(formData.temperature),
            humidity: parseFloat(formData.humidity),
          },
        };

        await mintProduct(metadata);
        onSuccess();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create NFT for {cropName}</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {imageFile ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="max-h-48 mx-auto"
                />
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  Click or drag image to upload
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature (°C)
            </label>
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Humidity (%)
            </label>
            <input
              type="number"
              name="humidity"
              value={formData.humidity}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !imageFile}
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" />
              Minting NFT...
            </span>
          ) : (
            'Mint NFT'
          )}
        </button>
      </form>
    </div>
  );
};