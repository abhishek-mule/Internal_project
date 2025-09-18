import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Wallet, ArrowLeft, Check, 
  Copy, QrCode, Shield, Clock, AlertCircle,
  Smartphone
} from 'lucide-react';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../../../context/AuthContext';
import { PaymentDetails } from '../services/PaymentService';

interface PaymentScreenProps {
  productId: string;
  amount: number;
  sellerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ 
  amount, 
  recipient, 
  onClose, 
  onSuccess 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'crypto' | 'upi' | null>(null);
  const [step, setStep] = useState<'select' | 'process' | 'success'>('select');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'crypto',
      name: 'Crypto Wallet',
      description: 'Pay with Bitcoin, Ethereum, or USDC',
      icon: Wallet,
      color: 'from-orange-500 to-yellow-500',
      features: ['Instant Settlement', 'Low Fees', 'Global Access']
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'Pay with any UPI app',
      icon: Smartphone,
      color: 'from-blue-500 to-purple-500',
      features: ['Instant Transfer', 'Bank Integration', 'Secure']
    }
  ];

  const cryptoWallets = [
    { name: 'MetaMask', address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4', icon: '🦊' },
    { name: 'Trust Wallet', address: '0x8f3CF7ad23Cd3CaDbD9735AFf958023239c6A063', icon: '🛡️' },
    { name: 'Coinbase', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', icon: '🔵' }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    setStep('process');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setStep('success');
    setIsProcessing(false);
    
    // Auto close after success
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">Secure Payment</h2>
            <div className="w-9 h-9"></div>
          </div>
          
          <div className="text-center">
            <p className="text-green-100 mb-2">Paying to</p>
            <p className="font-semibold text-lg">{recipient}</p>
            <p className="text-3xl font-bold mt-2">${amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Choose Payment Method</h3>
                
                <div className="space-y-4 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as 'crypto' | 'upi')}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color}`}>
                          <method.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-gray-900">{method.name}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {method.features.map((feature, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedMethod === 'crypto' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6"
                  >
                    <h4 className="font-semibold text-gray-900 mb-3">Select Wallet</h4>
                    <div className="space-y-2">
                      {cryptoWallets.map((wallet, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{wallet.icon}</span>
                            <div>
                              <p className="font-medium text-gray-900">{wallet.name}</p>
                              <p className="text-xs text-gray-500 font-mono">
                                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(wallet.address)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {selectedMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6"
                  >
                    <div className="bg-blue-50 rounded-2xl p-4 text-center">
                      <QrCode className="w-24 h-24 mx-auto text-blue-600 mb-4" />
                      <p className="text-sm text-blue-800 font-medium mb-2">
                        Scan QR code with any UPI app
                      </p>
                      <p className="text-xs text-blue-600">
                        farmconnect@upi • Amount: ₹{(amount * 83).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={!selectedMethod}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue Payment
                </button>

                <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </motion.div>
            )}

            {step === 'process' && (
              <motion.div
                key="process"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                <p className="text-gray-600 mb-4">Please wait while we process your transaction</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>This may take a few moments</span>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">Your transaction has been completed</p>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-800">
                    Transaction ID: <span className="font-mono">TX{Date.now()}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};