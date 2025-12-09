import React from 'react';
import { Transaction } from '../types.ts';
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {transactions.length === 0 ? (
           <div className="p-8 text-center text-gray-500">No recent transactions</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <li key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    t.type === 'received' ? 'bg-green-100 text-green-600' :
                    t.type === 'sent' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {t.type === 'received' && <ArrowDownLeft size={20} />}
                    {t.type === 'sent' && <ArrowUpRight size={20} />}
                    {t.type === 'exchange' && <RefreshCw size={18} />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.counterparty}</p>
                    <p className="text-xs text-gray-500 capitalize">{t.type} • {t.date}</p>
                  </div>
                </div>
                <div className={`text-sm font-bold ${
                   t.type === 'received' ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {t.type === 'received' ? '+' : '-'}{t.amount} {t.currency}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransactionList;