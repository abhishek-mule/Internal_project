import React from 'react';
import { useParams } from 'react-router-dom';
import { NFTDetails } from '../components/nft/NFTDetails';

export const VerificationPage: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();

  if (!tokenId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-bold mb-2">Invalid Token ID</h2>
            <p>No product token ID was provided for verification.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Product Verification
          </h1>
          <NFTDetails tokenId={tokenId} />
        </div>
      </div>
    </div>
  );
};