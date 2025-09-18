import { useState, useCallback } from 'react';
import { useContract } from '@thirdweb-dev/react';
import { Dropzone } from '../common/Dropzone';

interface NFTFormData {
  name: string;
  description: string;
  image: File | null;
  properties: Record<string, string>;
}

export const NFTFormUploader = () => {
  const [formData, setFormData] = useState<NFTFormData>({
    name: '',
    description: '',
    image: null,
    properties: {}
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { contract } = useContract(import.meta.env.VITE_NFT_DROP_ADDRESS, 'nft-drop');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onDropImage = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFormData(prev => ({ ...prev, image: acceptedFiles[0] }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contract) {
      setError('Contract not connected');
      return;
    }

    if (!formData.name || !formData.image) {
      setError('Name and image are required');
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      // In a real app, you would upload to IPFS here
      // For now, we'll just use a placeholder
      const imageUrl = URL.createObjectURL(formData.image);
      
      // Prepare metadata
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        properties: formData.properties
      };

      // Mint the NFT
      const tx = await contract.erc721.lazyMint([metadata]);
      console.log('NFT minted successfully:', tx);
      
      alert('NFT created successfully! 🎉');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        image: null,
        properties: {}
      });
    } catch (err) {
      const error = err as Error;
      console.error('Error creating NFT:', error);
      setError(`Failed to create NFT: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create Single NFT</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Image *</label>
          <Dropzone 
            onDrop={onDropImage}
            accept={{'image/*': ['.png', '.jpg', '.jpeg', '.gif']}}
            maxFiles={1}
          >
            {formData.image ? (
              <div className="space-y-2">
                <div className="font-medium">Image selected</div>
                <div className="text-sm text-gray-500">Click to change</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>Drag & drop an image here</div>
                <div className="text-sm text-gray-500">or click to select</div>
              </div>
            )}
          </Dropzone>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Minting...' : 'Mint NFT'}
        </button>
      </form>
    </div>
  );
};
