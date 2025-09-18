import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { NFTDropUploader } from './NFTDropUploader';
import { NFTFormUploader } from './NFTFormUploader';

export const NFTDropManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'form' | 'csv'>('form');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Home
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('form')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'form'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Single NFT
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'csv'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bulk Upload (CSV)
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'form' ? <NFTFormUploader /> : <NFTDropUploader />}
        </div>
      </div>
    </div>
  );
};
