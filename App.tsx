import React, { useState, useEffect } from 'react';
import { AppView, Transaction, User } from './types.ts';
import { MOCK_USER, INITIAL_TRANSACTIONS } from './constants.ts';
import { getFinancialInsight } from './services/geminiService.ts';
import WalletCard from './components/WalletCard.tsx';
import Navigation from './components/Navigation.tsx';
import TransactionList from './components/TransactionList.tsx';
import ExchangeFeature from './components/ExchangeFeature.tsx';
import { Bell, Settings, TrendingUp, Shield, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [insight, setInsight] = useState<string>('Loading personalized insights...');

  // Effect to load insights on mount
  useEffect(() => {
    getFinancialInsight(transactions, user.walletBalance).then(setInsight);
  }, [transactions, user.walletBalance]);

  const handleTransactionComplete = (amount: number, currency: string) => {
    // Deduct from wallet (simplified logic assuming base currency for now or auto-conversion)
    const newBalance = user.walletBalance - amount; // In a real app, handle currency conversion
    
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      type: 'sent',
      amount: amount,
      currency: currency,
      counterparty: 'P2P Exchange',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };

    setUser({ ...user, walletBalance: newBalance });
    setTransactions([newTx, ...transactions]);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <div className="space-y-6 pb-24 animate-fade-in">
            <WalletCard user={user} />
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => setCurrentView(AppView.EXCHANGE)}
                 className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 active:bg-gray-50"
               >
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                    <TrendingUp size={20} />
                 </div>
                 <span className="text-sm font-semibold text-gray-800">Send Money</span>
               </button>
               <button 
                 onClick={() => setCurrentView(AppView.EXCHANGE)}
                 className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 active:bg-gray-50"
               >
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <Shield size={20} />
                 </div>
                 <span className="text-sm font-semibold text-gray-800">Request</span>
               </button>
            </div>

            <TransactionList transactions={transactions} />
          </div>
        );
      case AppView.EXCHANGE:
        return (
          <div className="animate-fade-in">
             <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Currency Exchange</h2>
                <p className="text-gray-500 text-sm">Find peers or broadcast your needs</p>
             </div>
             <ExchangeFeature user={user} onTransactionComplete={handleTransactionComplete} />
          </div>
        );
      case AppView.INSIGHTS:
        return (
          <div className="space-y-6 animate-fade-in pb-24">
             <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Financial Insights</h2>
                <p className="text-gray-500 text-sm">Powered by Gemini AI</p>
             </div>
             
             <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-start space-x-3 mb-2">
                   <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <TrendingUp size={24} className="text-white" />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg">Weekly Summary</h3>
                      <p className="text-blue-100 text-sm opacity-90">{insight}</p>
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Spending by Category</h3>
                {/* Mock Chart Visualization */}
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Travel & Transport</span>
                      <span className="font-bold text-gray-900">45%</span>
                   </div>
                   <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[45%]"></div>
                   </div>
                   
                   <div className="flex items-center justify-between text-sm pt-2">
                      <span className="text-gray-600">Food & Dining</span>
                      <span className="font-bold text-gray-900">30%</span>
                   </div>
                   <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[30%]"></div>
                   </div>

                   <div className="flex items-center justify-between text-sm pt-2">
                      <span className="text-gray-600">Services</span>
                      <span className="font-bold text-gray-900">25%</span>
                   </div>
                   <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[25%]"></div>
                   </div>
                </div>
             </div>
          </div>
        );
      case AppView.PROFILE:
        return (
          <div className="space-y-6 animate-fade-in pb-24">
            <div className="text-center py-8">
               <div className="relative inline-block">
                  <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto" alt="Profile" />
                  <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
               </div>
               <h2 className="text-2xl font-bold mt-4 text-gray-900">{user.name}</h2>
               <p className="text-gray-500">ID: {user.id}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <button className="w-full p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center space-x-3 text-gray-700">
                     <Settings size={20} />
                     <span className="font-medium">Account Settings</span>
                  </div>
                  <span className="text-gray-400">›</span>
               </button>
               <button className="w-full p-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center space-x-3 text-gray-700">
                     <Shield size={20} />
                     <span className="font-medium">Security & Privacy</span>
                  </div>
                  <span className="text-gray-400">›</span>
               </button>
               <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-3 text-gray-700">
                     <HelpCircle size={20} />
                     <span className="font-medium">Help & Support</span>
                  </div>
                  <span className="text-gray-400">›</span>
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans max-w-lg mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40 border-b border-gray-100">
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">F</div>
            <span className="text-xl font-bold tracking-tight text-gray-900">FlowCash</span>
        </div>
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="px-4 py-6">
        {renderContent()}
      </main>

      {/* Navigation */}
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
      
      {/* Simple Global Styles for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;