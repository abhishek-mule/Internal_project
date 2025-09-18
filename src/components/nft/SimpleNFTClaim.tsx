import { useState, useMemo } from 'react';
import { 
  ConnectWallet, 
  useAddress, 
  useContract, 
  useClaimNFT, 
  useChainId,
  useSwitchChain
} from "@thirdweb-dev/react";

const SimpleNFTClaim = () => {
  const address = useAddress();
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chainId = useChainId();
  const switchChain = useSwitchChain();
  
  // Get the target chain ID from environment variables or default to Amoy testnet (80002)
  const targetChainId = parseInt(import.meta.env.VITE_APP_CHAIN_ID || '80002', 10);
  
  // Safely check if we're on the wrong network
  const isWrongNetwork = chainId !== undefined && chainId !== targetChainId;
  
  // Get the NFT Drop contract address from environment variables
  const nftDropAddress = import.meta.env.VITE_NFT_DROP_ADDRESS || '';
  
  // Initialize contract hooks unconditionally
  const { contract: nftDrop } = useContract(nftDropAddress, "nft-drop");
  const { mutateAsync: claimNft } = useClaimNFT(nftDrop);
  
  // Check for configuration errors
  const configError = useMemo(() => {
    if (!nftDropAddress) {
      return "NFT Drop contract address is not configured. Please check your environment variables.";
    }
    if (nftDrop === undefined) {
      return "Failed to initialize NFT Drop contract. Please check the contract address.";
    }
    return null;
  }, [nftDrop, nftDropAddress]);

  const handleClaim = async () => {
    if (!address) {
      setError("Please connect your wallet first!");
      return;
    }

    if (isWrongNetwork) {
      await handleSwitchNetwork();
      return;
    }

    if (!nftDrop || !claimNft) {
      setError("NFT Drop contract is not properly initialized");
      return;
    }

    setIsClaiming(true);
    setError(null);
    
    try {
      const tx = await claimNft({
        to: address,
        quantity: 1,
      });
      
      console.log("Successfully claimed NFT!", tx);
      alert("Successfully claimed your NFT!");
    } catch (err) {
      console.error("Failed to claim NFT:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to claim NFT. Please try again.";
      setError(errorMessage);
    } finally {
      setIsClaiming(false);
    }
  };
  
  // Handle network switch when needed
  const handleSwitchNetwork = async () => {
    try {
      setIsClaiming(true);
      await switchChain(targetChainId);
      // After switching, we'll let the component re-render with the new network state
    } catch (err) {
      console.error("Failed to switch network:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to switch network";
      setError(`Failed to switch network: ${errorMessage}`);
    } finally {
      setIsClaiming(false);
    }
  };
  
  // Show loading state while checking network
  if (chainId === undefined) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">Checking network...</p>
      </div>
    );
  }
  
  // Show configuration errors if any
  if (configError) {
    return (
      <div className="p-4 text-red-600">
        <p className="font-medium">Configuration Error</p>
        <p className="text-sm">{configError}</p>
        <p className="mt-2 text-xs">Please contact support if this issue persists.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl mb-4">
          🌱
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Claim Your Farm NFT</h2>
        <p className="text-gray-600 mb-6">Own a piece of the agricultural revolution</p>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-medium">Network: {chainId === 80002 ? 'Polygon Amoy Testnet' : `Chain ID: ${chainId}`}</p>
          <p>Status: {isWrongNetwork ? '❌ Wrong Network' : '✅ Connected'}</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {!address ? (
          <ConnectWallet 
            theme="dark"
            btnTitle="Connect Wallet to Claim"
            className="w-full"
          />
        ) : isWrongNetwork ? (
          <button
            onClick={handleSwitchNetwork}
            className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
            disabled={isClaiming}
          >
            {isClaiming ? 'Switching...' : 'Switch to Correct Network'}
          </button>
        ) : (
          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-colors ${
              isClaiming 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isClaiming ? 'Claiming...' : 'Claim Your NFT'}
          </button>
        )}
        
        <div className="mt-6 text-sm text-gray-500">
          <p>• Connect your wallet to claim your NFT</p>
          <p>• Make sure you're on the correct network (Polygon Amoy Testnet)</p>
          <p>• You'll need MATIC for gas fees</p>
          <p className="mt-2 text-xs opacity-75">
            Having issues? Try refreshing the page or switching networks in your wallet
          </p>
        </div>
        
        {address && (
          <div className="mt-4 text-xs text-gray-400">
            Connected Wallet: {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
          </div>
        )}
      </div>
    </div>
  );
};

export { SimpleNFTClaim };
