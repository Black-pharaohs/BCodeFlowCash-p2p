export interface User {
  id: string;
  name: string;
  avatar: string;
  walletBalance: number;
  baseCurrency: string;
}

export interface CurrencyRate {
  code: string;
  rateToUSD: number; // Simplified: everything relative to USD
  symbol: string;
  name: string;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'exchange';
  amount: number;
  currency: string;
  counterparty: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface NearbyRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  distanceKm: number;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  expiresAt: number;
}

export enum AppView {
  HOME = 'HOME',
  EXCHANGE = 'EXCHANGE',
  INSIGHTS = 'INSIGHTS',
  PROFILE = 'PROFILE'
}
