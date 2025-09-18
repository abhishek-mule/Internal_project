import { useState, useCallback } from 'react';
import { useContract } from '@thirdweb-dev/react';
import { Dropzone } from '../common/Dropzone';

interface CSVData {
  [key: string]: string;
}

export const NFTDropUploader = () => {
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { contract } = useContract(import.meta.env.VITE_NFT_DROP_ADDRESS, 'nft-drop');

  const onDropCsv = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',').map(h => h.trim());
        
        const data = rows.slice(1).map(row => {
          const values = row.split(',').map(v => v.trim());
          return headers.reduce((obj: CSVData, key, i) => {
            obj[key] = values[i] || '';
            return obj;
          }, {});
        });
        
        setCsvData(data);
        setError(null);
      } catch (err) {
        setError('Invalid CSV format. Please check your file and try again.');
        console.error('Error parsing CSV:', err);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading the file. Please try again.');
    };
    
    reader.readAsText(file);
  }, []);

  const onDropAssets = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const uploadNFTs = async () => {
    if (!contract) {
      setError('Contract not connected');
      return;
    }
    
    if (csvData.length === 0) {
      setError('Please upload a CSV file first');
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      // Prepare metadata array for lazyMint
      const metadatas = csvData.map((item, index) => {
        const metadata: Record<string, unknown> = { ...item };
        
        // If we have a corresponding file, use it as the image
        if (files[index]) {
          metadata.image = files[index];
        }
        
        return metadata;
      });

      // Call lazyMint
      const results = await contract.erc721.lazyMint(metadatas);
      console.log('Successfully uploaded NFTs:', results);
      alert(`Successfully uploaded ${metadatas.length} NFTs! 🎉`);
      
      // Reset form
      setCsvData([]);
      setFiles([]);
    } catch (err) {
      const error = err as Error;
      console.error('Error uploading NFTs:', error);
      setError(`Failed to upload NFTs: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold">Bulk NFT Upload (CSV)</h2>
      
      {/* CSV Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">1. Upload CSV File</h3>
        <Dropzone 
          onDrop={onDropCsv}
          accept={{'text/csv': ['.csv']}}
          maxFiles={1}
        >
          {csvData.length > 0 ? (
            <div className="space-y-2">
              <div className="font-medium">CSV loaded with {csvData.length} items</div>
              <div className="text-sm text-gray-500">Click to change file</div>
            </div>
          ) : (
            <div className="space-y-2">
              <div>Drag & drop CSV file here</div>
              <div className="text-sm text-gray-500">or click to select</div>
            </div>
          )}
        </Dropzone>
      </div>

      {/* Assets Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">2. Upload NFT Assets (Optional)</h3>
        <Dropzone 
          onDrop={onDropAssets}
          accept={{'image/*': ['.png', '.jpg', '.jpeg', '.gif']}}
          multiple
        >
          <div className="space-y-2">
            <div>{files.length} file{files.length !== 1 ? 's' : ''} ready</div>
            <div className="text-sm text-gray-500">
              {files.length === 0 ? 'Drag & drop image files here or click to select' : 'Drop more files or click to select'}
            </div>
          </div>
        </Dropzone>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Upload Button */}
      <div className="pt-4">
        <button
          onClick={uploadNFTs}
          disabled={!csvData.length || isUploading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : `Upload ${csvData.length} NFTs`}
        </button>
      </div>
    </div>
  );
};
