import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, ArrowRight, ShieldCheck, User as UserIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { NearbyRequest, User, CurrencyRate } from '../types.ts';
import { MOCK_NEARBY_REQUESTS, CURRENCIES } from '../constants.ts';
import { parseNaturalLanguageRequest, getSafetyAnalysis } from '../services/geminiService.ts';

interface ExchangeFeatureProps {
  user: User;
  onTransactionComplete: (amount: number, currency: string) => void;
}

const ExchangeFeature: React.FC<ExchangeFeatureProps> = ({ user, onTransactionComplete }) => {
  const [mode, setMode] = useState<'request' | 'provide'>('provide');
  const [nearbyRequests, setNearbyRequests] = useState<NearbyRequest[]>(MOCK_NEARBY_REQUESTS);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  
  // Request Form State
  const [nlInput, setNlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedRequest, setParsedRequest] = useState<{amount: number, from: string, to: string} | null>(null);

  // Provide State
  const [selectedRequest, setSelectedRequest] = useState<NearbyRequest | null>(null);
  const [safetyTip, setSafetyTip] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check geolocation permission on mount
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state === 'granted');
      });
    }
  }, []);

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission(true),
        () => setLocationPermission(false)
      );
    }
  };

  const handleSmartAnalyze = async () => {
    if (!nlInput.trim()) return;
    setIsAnalyzing(true);
    const result = await parseNaturalLanguageRequest(nlInput);
    if (result) {
      setParsedRequest({
        amount: result.amount,
        from: result.fromCurrency || 'USD',
        to: result.toCurrency
      });
    }
    setIsAnalyzing(false);
  };

  const handleSelectNearby = async (req: NearbyRequest) => {
    setSelectedRequest(req);
    const safety = await getSafetyAnalysis(req);
    setSafetyTip(safety);
  };

  const handleConfirmTransaction = () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
        onTransactionComplete(selectedRequest.amount * selectedRequest.rate, selectedRequest.toCurrency);
        setNearbyRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
        setSelectedRequest(null);
        setIsProcessing(false);
        alert(`Transaction Successful! You exchanged ${selectedRequest.amount} ${selectedRequest.fromCurrency}.`);
    }, 2000);
  };

  const handlePostRequest = () => {
    if(!parsedRequest) return;
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        setNlInput('');
        setParsedRequest(null);
        alert("Your request has been broadcasted to nearby peers!");
    }, 1500);
  };

  const getCurrencySymbol = (code: string) => CURRENCIES.find(c => c.code === code)?.symbol || code;

  return (
    <div className="space-y-6 pb-24">
      {/* Mode Switcher */}
      <div className="bg-gray-100 p-1 rounded-xl flex">
        <button
          onClick={() => setMode('provide')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            mode === 'provide' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          Find Nearby Requests
        </button>
        <button
          onClick={() => setMode('request')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            mode === 'request' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          Create Request
        </button>
      </div>

      {mode === 'provide' && (
        <div className="space-y-4">
          {!locationPermission && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start space-x-3">
              <MapPin className="text-yellow-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-yellow-800 font-medium">Location access needed</p>
                <p className="text-xs text-yellow-600 mt-1">Enable location to see real-time requests around you.</p>
                <button 
                    onClick={requestLocation}
                    className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-md font-semibold hover:bg-yellow-200"
                >
                    Enable Location
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 flex items-center">
                <Search size={18} className="mr-2" />
                Opportunities Near You
            </h3>
            {nearbyRequests.map((req) => (
              <div 
                key={req.id} 
                onClick={() => handleSelectNearby(req)}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                        <img src={req.userAvatar} alt={req.userName} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                        <div>
                            <p className="font-semibold text-gray-900">{req.userName}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                                <MapPin size={10} className="mr-1" />
                                {req.distanceKm} km away
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-blue-600 text-lg">
                            {getCurrencySymbol(req.fromCurrency)}{req.amount}
                        </span>
                        <span className="text-xs text-gray-400">Requesting {req.toCurrency}</span>
                    </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg flex justify-between items-center text-xs text-gray-600">
                    <span>Rate: 1 {req.fromCurrency} = {req.rate} {req.toCurrency}</span>
                    <span className="text-green-600 font-medium">Verified Peer</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'request' && (
        <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <label className="block text-sm font-semibold text-blue-900 mb-2">Smart Request (AI)</label>
                <div className="relative">
                    <textarea 
                        className="w-full p-3 rounded-lg border border-blue-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                        placeholder='e.g., "I need 200 euros for my trip, I can pay in USD."'
                        value={nlInput}
                        onChange={(e) => setNlInput(e.target.value)}
                    />
                    <button 
                        onClick={handleSmartAnalyze}
                        disabled={isAnalyzing || !nlInput}
                        className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isAnalyzing ? <RefreshCw className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                    </button>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                    Describe what you need naturally. Gemini will format it for you.
                </p>
            </div>

            {parsedRequest && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm animate-fade-in">
                    <h4 className="font-bold text-gray-800 mb-4">Confirm Request</h4>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="block text-xs text-gray-500">You Offer</span>
                            <span className="block text-lg font-bold text-gray-900">{parsedRequest.from}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="block text-xs text-gray-500">You Need</span>
                            <span className="block text-lg font-bold text-blue-600">{parsedRequest.amount} {parsedRequest.to}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handlePostRequest}
                        disabled={isProcessing}
                        className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors flex justify-center items-center"
                    >
                        {isProcessing ? <RefreshCw className="animate-spin mr-2" /> : 'Broadcast Request'}
                    </button>
                </div>
            )}
        </div>
      )}

      {/* Transaction Modal / Sheet */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Review Transaction</h3>
                    <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-6">
                    <div className="flex flex-col items-center">
                        <img src={user.avatar} className="w-12 h-12 rounded-full mb-1" />
                        <span className="text-xs font-medium">You</span>
                    </div>
                    <ArrowRight className="text-gray-400" />
                    <div className="flex flex-col items-center">
                        <img src={selectedRequest.userAvatar} className="w-12 h-12 rounded-full mb-1" />
                        <span className="text-xs font-medium">{selectedRequest.userName.split(' ')[0]}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">You Pay</span>
                        <span className="font-bold">{getCurrencySymbol(selectedRequest.toCurrency)} {(selectedRequest.amount * selectedRequest.rate).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">You Receive</span>
                        <span className="font-bold text-green-600">{getCurrencySymbol(selectedRequest.fromCurrency)} {selectedRequest.amount}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Exchange Rate</span>
                        <span className="font-mono text-xs">{selectedRequest.rate}</span>
                    </div>
                </div>

                {safetyTip && (
                    <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-2 mb-6">
                        <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs text-blue-800 leading-relaxed">
                            <span className="font-bold">AI Safety Check:</span> {safetyTip}
                        </p>
                    </div>
                )}

                <button 
                    onClick={handleConfirmTransaction}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center"
                >
                    {isProcessing ? 'Processing Securely...' : 'Confirm & Pay'}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeFeature;