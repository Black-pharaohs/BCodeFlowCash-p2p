import React from 'react';
import { Wallet, CreditCard } from 'lucide-react';
import { User } from '../types.ts';

interface WalletCardProps {
  user: User;
}

const WalletCard: React.FC<WalletCardProps> = ({ user }) => {
  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 p-6 text-white shadow-xl shadow-blue-900/20">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-white opacity-10"></div>

      <div className="relative z-10 flex flex-col justify-between h-40">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-sm font-medium tracking-wide">TOTAL BALANCE</p>
            <h2 className="text-3xl font-bold mt-1">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: user.baseCurrency }).format(user.walletBalance)}
            </h2>
          </div>
          <Wallet className="text-blue-300 opacity-80" size={28} />
        </div>

        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-xs text-blue-200 uppercase tracking-wider mb-1">Card Holder</span>
            <span className="font-medium tracking-wide">{user.name}</span>
          </div>
          <div className="flex items-center space-x-2">
             <CreditCard size={20} className="text-blue-200"/>
             <span className="text-sm font-mono text-blue-100">•••• 4289</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;