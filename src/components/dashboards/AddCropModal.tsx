import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CropMetadata } from '../../types';
import { useContract } from '../../hooks/useContract';

interface AddCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (cropId: string) => void;
}

export const AddCropModal: React.FC<AddCropModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    quantity: '',
    unit: 'lbs',
    pricePerUnit: '',
    plantedDate: '',
    expectedHarvest: '',
    description: '',
    image: null as File | null
  });

  const { contract } = useContract('FarmProduct');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setIsLoading(true);

      // Convert form data to NFT metadata
      const metadata: CropMetadata = {
        name: formData.name,
        description: formData.description,
        image: formData.image ? URL.createObjectURL(formData.image) : '',
        properties: {
          variety: formData.variety,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          pricePerUnit: parseFloat(formData.pricePerUnit),
          plantedDate: formData.plantedDate,
          expectedHarvest: formData.expectedHarvest,
          status: 'growing' as const,
          progress: 0,
          health: 100
        }
      };

      // Mint the NFT
      const tokenId = await contract.mintProduct(metadata);
      onSuccess(tokenId);
      onClose();
    } catch (error) {
      console.error('Failed to add crop:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-25"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Crop</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="form-field">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Crop Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                        placeholder="e.g., Cherry Tomatoes"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="form-field">
                      <label htmlFor="variety" className="block text-sm font-medium text-gray-700 mb-1">
                        Variety
                      </label>
                      <input
                        type="text"
                        id="variety"
                        name="variety"
                        required
                        value={formData.variety}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                        placeholder="e.g., Organic"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="form-field">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          required
                          value={formData.quantity}
                          onChange={handleChange}
                          className="w-full rounded-l-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                          placeholder="0"
                        />
                        <select
                          id="unit"
                          name="unit"
                          value={formData.unit}
                          onChange={handleChange}
                          className="rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                        >
                          <option value="lbs">lbs</option>
                          <option value="kg">kg</option>
                          <option value="units">units</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="form-field">
                      <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700 mb-1">
                        Price per Unit
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          id="pricePerUnit"
                          name="pricePerUnit"
                          required
                          step="0.01"
                          value={formData.pricePerUnit}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 focus:border-green-500 focus:ring-green-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="form-field">
                      <label htmlFor="plantedDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Planting Date
                      </label>
                      <input
                        type="date"
                        id="plantedDate"
                        name="plantedDate"
                        required
                        value={formData.plantedDate}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="form-field">
                      <label htmlFor="expectedHarvest" className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Harvest
                      </label>
                      <input
                        type="date"
                        id="expectedHarvest"
                        name="expectedHarvest"
                        required
                        value={formData.expectedHarvest}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="form-field">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                      placeholder="Add any additional details about your crop..."
                    />
                  </div>
                </div>

                <div>
                  <div className="form-field">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <span>Add Crop</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};