import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Truck, Package, Sprout, Award } from 'lucide-react';

export function CustomerJourney() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQRScan, setShowQRScan] = useState(true);
  const [scanComplete, setScanComplete] = useState(false);

  const journeySteps = [
    {
      id: 1,
      title: 'Seed Planted',
      description: 'Organic tomato seeds planted by Sarah Johnson at Green Valley Farm',
      date: 'March 15, 2024',
      icon: Sprout,
      color: 'bg-green-500',
      details: 'Heritage variety seeds, certified organic soil preparation'
    },
    {
      id: 2,
      title: 'Growing & Care',
      description: 'Carefully tended with natural fertilizers and sustainable irrigation',
      date: 'April 20, 2024',
      icon: CheckCircle,
      color: 'bg-green-600',
      details: 'Weekly soil testing, natural pest control, optimal water management'
    },
    {
      id: 3,
      title: 'Harvest Ready',
      description: 'Perfectly ripened tomatoes harvested at peak freshness',
      date: 'June 10, 2024',
      icon: Award,
      color: 'bg-orange-500',
      details: 'Hand-picked at dawn, quality tested, packed within 2 hours'
    },
    {
      id: 4,
      title: 'Processing',
      description: 'Cleaned, sorted and packaged at certified organic facility',
      date: 'June 10, 2024',
      icon: Package,
      color: 'bg-blue-500',
      details: 'Temperature controlled, minimal handling, eco-friendly packaging'
    },
    {
      id: 5,
      title: 'In Transit',
      description: 'Shipped via climate-controlled transport to local distributor',
      date: 'June 11, 2024',
      icon: Truck,
      color: 'bg-purple-500',
      details: 'Carbon-neutral delivery, real-time temperature monitoring'
    }
  ];

  useEffect(() => {
    if (scanComplete) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => (prev < journeySteps.length ? prev + 1 : prev));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [scanComplete, journeySteps.length]);

  const handleQRScan = () => {
    setScanComplete(true);
    setTimeout(() => setShowQRScan(false), 2000);
  };

  if (showQRScan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className={`mx-auto w-48 h-48 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 transition-all duration-500 ${scanComplete ? 'border-green-500 scale-110' : 'border-gray-200'}`}>
              <QrCode className={`w-32 h-32 transition-all duration-500 ${scanComplete ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            {scanComplete && (
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {scanComplete ? 'Scanning Complete!' : 'Scan Your Product'}
          </h2>
          <p className="text-gray-600 mb-8">
            {scanComplete 
              ? 'Loading your product story...' 
              : 'Point your camera at the QR code to discover the amazing journey of your food'
            }
          </p>
          
          {!scanComplete && (
            <button
              onClick={handleQRScan}
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-blue-700"
            >
              Simulate QR Scan
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍅</span>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">Organic Cherry Tomatoes</h1>
              <p className="text-sm text-gray-600">Green Valley Farm</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Food's Story</h2>
          <p className="text-xl text-gray-600">Follow the magical journey from farm to your table</p>
        </div>

        {/* Journey Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
          <div 
            className="absolute left-8 top-0 w-1 bg-gradient-to-b from-green-500 to-blue-500 rounded-full transition-all duration-1000"
            style={{ height: `${(currentStep / journeySteps.length) * 100}%` }}
          ></div>

          {/* Journey Steps */}
          <div className="space-y-8">
            {journeySteps.map((step, index) => (
              <div
                key={step.id}
                className={`relative flex items-start transition-all duration-500 ${
                  index < currentStep ? 'opacity-100 transform translate-x-0' : 'opacity-50 transform translate-x-4'
                }`}
              >
                {/* Step Icon */}
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-500 ${
                  index < currentStep ? step.color : 'bg-gray-300'
                }`}>
                  <step.icon className="w-8 h-8 text-white" />
                  {index < currentStep && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                      <CheckCircle className="w-4 h-4 text-yellow-800" />
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="ml-6 flex-1">
                  <div className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-500 ${
                    index < currentStep ? 'shadow-xl border-l-4 border-green-500' : 'shadow-md'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {step.date}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{step.description}</p>
                    <p className="text-sm text-gray-600 italic">{step.details}</p>
                    
                    {index < currentStep && (
                      <div className="mt-4 flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Verified & Complete</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Complete */}
        {currentStep >= journeySteps.length && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
              <Award className="w-16 h-16 mx-auto mb-4 animate-bounce" />
              <h3 className="text-3xl font-bold mb-4">Journey Complete!</h3>
              <p className="text-xl mb-6">Your organic cherry tomatoes have traveled 127 miles with love and care</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="font-semibold">Carbon Footprint: 2.3kg CO₂</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="font-semibold">Farm-to-Table: 2 days</span>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="font-semibold">Freshness Score: 98%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}