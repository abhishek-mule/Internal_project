import React, { useEffect, useState } from 'react';
import { useContract } from '../../context/ContractContext';
import { Clock, MapPin, Thermometer, Droplets } from 'lucide-react';
import QRCode from 'qrcode.react';

interface NFTDetailsProps {
  tokenId: string;
}

interface NFTHistory {
  timestamp: number;
  action: string;
  from: string;
  to: string;
}

export const NFTDetails: React.FC<NFTDetailsProps> = ({ tokenId }) => {
  const { getProduct } = useContract();
  const [nftData, setNftData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<NFTHistory[]>([]);

  useEffect(() => {
    loadNFTData();
  }, [tokenId]);

  const loadNFTData = async () => {
    try {
      setIsLoading(true);
      const data = await getProduct(tokenId);
      setNftData(data);
      // In a real application, you would fetch the transfer history from the blockchain
      const mockHistory: NFTHistory[] = [
        {
          timestamp: Date.now() - 86400000, // 1 day ago
          action: 'Minted',
          from: '0x0000000000000000000000000000000000000000',
          to: data.owner,
        },
      ];
      setHistory(mockHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load NFT data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !nftData) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Failed to load NFT data'}
      </div>
    );
  }

  const verificationUrl = `${window.location.origin}/verify/${tokenId}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{nftData.metadata.name}</h2>
            <p className="text-gray-600">{nftData.metadata.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Token ID</div>
            <div className="font-mono">{tokenId}</div>
          </div>
        </div>

        <div className="mb-6">
          <img
            src={nftData.metadata.image}
            alt={nftData.metadata.name}
            className="w-full rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <div>
              <div className="text-sm text-gray-500">Location</div>
              <div>{nftData.metadata.properties.location}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-400 mr-2" />
            <div>
              <div className="text-sm text-gray-500">Timestamp</div>
              <div>
                {new Date(nftData.metadata.properties.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Thermometer className="w-5 h-5 text-gray-400 mr-2" />
            <div>
              <div className="text-sm text-gray-500">Temperature</div>
              <div>{nftData.metadata.properties.temperature}°C</div>
            </div>
          </div>
          <div className="flex items-center">
            <Droplets className="w-5 h-5 text-gray-400 mr-2" />
            <div>
              <div className="text-sm text-gray-500">Humidity</div>
              <div>{nftData.metadata.properties.humidity}%</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Verification QR Code</h3>
          <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
            <QRCode value={verificationUrl} size={200} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Transfer History</h3>
          <div className="space-y-2">
            {history.map((event, index) => (
              <div
                key={index}
                className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{event.action}</div>
                  <div className="text-sm text-gray-500">
                    From: {event.from.slice(0, 6)}...{event.from.slice(-4)}
                  </div>
                  <div className="text-sm text-gray-500">
                    To: {event.to.slice(0, 6)}...{event.to.slice(-4)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};