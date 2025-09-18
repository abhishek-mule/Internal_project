import { Link } from 'react-router-dom';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { SimpleNFTClaim } from '@/components/nft/SimpleNFTClaim';

export const ClaimPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Claim Your NFT</h1>
          <p className="text-gray-600 mb-6">Connect your wallet to claim your exclusive NFT</p>
          <Link 
            to="/drop" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            Create your own NFT Drop <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <SimpleNFTClaim />
        </div>
      </div>
    </div>
  );
};

export default ClaimPage;
