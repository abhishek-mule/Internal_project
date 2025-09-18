import { useContract, useAddress, useClaimNFT, useNetwork } from "@thirdweb-dev/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface NFTClaimButtonProps {
  contractAddress: string;
  quantity?: number;
  className?: string;
}

export const NFTClaimButton: React.FC<NFTClaimButtonProps> = ({
  contractAddress,
  quantity = 1,
  className = "",
}) => {
  const address = useAddress();
  const [isClaiming, setIsClaiming] = useState(false);
  const { contract: nftDrop } = useContract(contractAddress, "nft-drop");
  const { mutateAsync: claimNft } = useClaimNFT(nftDrop);
  const [network] = useNetwork();

  const handleClaim = async () => {
    if (!address) {
      toast.error("Please connect your wallet first!");
      return;
    }

    if (!nftDrop) {
      toast.error("NFT Drop contract not found");
      return;
    }

    try {
      setIsClaiming(true);
      toast.loading("Claiming your NFT...");
      
      const tx = await claimNft({
        to: address,
        quantity: quantity,
      });
      
      toast.dismiss();
      toast.success("NFT claimed successfully!");
      console.log("Claimed NFT:", tx);
      
      // Refresh the page or update UI as needed
      window.location.reload();
    } catch (error) {
      console.error("Failed to claim NFT:", error);
      toast.dismiss();
      toast.error("Failed to claim NFT. Check console for details.");
    } finally {
      setIsClaiming(false);
    }
  };

  if (network?.data?.chain?.unsupported) {
    return (
      <button
        disabled
        className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium opacity-50 cursor-not-allowed"
      >
        Wrong Network
      </button>
    );
  }

  return (
    <button
      onClick={handleClaim}
      disabled={isClaiming || !address}
      className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors ${
        isClaiming ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isClaiming ? "Claiming..." : "Claim Your NFT"}
    </button>
  );
};

export default NFTClaimButton;
