import { CurrencyRate, NearbyRequest, Transaction, User } from './types.ts';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  avatar: 'https://picsum.photos/200',
  walletBalance: 2450.00,
  baseCurrency: 'USD'
};

export const CURRENCIES: CurrencyRate[] = [
  { code: 'USD', rateToUSD: 1, symbol: '$', name: 'US Dollar' },
  { code: 'EUR', rateToUSD: 1.08, symbol: '€', name: 'Euro' },
  { code: 'GBP', rateToUSD: 1.26, symbol: '£', name: 'British Pound' },
  { code: 'JPY', rateToUSD: 0.0065, symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', rateToUSD: 0.74, symbol: 'C$', name: 'Canadian Dollar' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'received', amount: 500, currency: 'USD', counterparty: 'Sarah Chen', date: '2023-10-25', status: 'completed' },
  { id: 't2', type: 'exchange', amount: 200, currency: 'EUR', counterparty: 'Exchange Service', date: '2023-10-24', status: 'completed' },
  { id: 't3', type: 'sent', amount: 50, currency: 'USD', counterparty: 'Uber Trip', date: '2023-10-23', status: 'completed' },
];

export const MOCK_NEARBY_REQUESTS: NearbyRequest[] = [
  {
    id: 'r1',
    userId: 'u2',
    userName: 'Jordan Smith',
    userAvatar: 'https://picsum.photos/201',
    distanceKm: 0.5,
    amount: 100,
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    rate: 0.92,
    expiresAt: Date.now() + 3600000
  },
  {
    id: 'r2',
    userId: 'u3',
    userName: 'Emily Doe',
    userAvatar: 'https://picsum.photos/202',
    distanceKm: 1.2,
    amount: 5000,
    fromCurrency: 'JPY',
    toCurrency: 'USD',
    rate: 0.0066,
    expiresAt: Date.now() + 7200000
  },
  {
    id: 'r3',
    userId: 'u4',
    userName: 'Michael Brown',
    userAvatar: 'https://picsum.photos/203',
    distanceKm: 2.5,
    amount: 50,
    fromCurrency: 'GBP',
    toCurrency: 'USD',
    rate: 1.25,
    expiresAt: Date.now() + 1800000
  }
];