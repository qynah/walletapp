export type WalletType = 'cash' | 'bank' | 'e-wallet' | 'credit' | 'savings';

export interface Wallet {
  id: string;
  name: string;
  budget: number;
  currentBalance: number;
  totalExpenditure: number;
  totalInCome: number;
  type: WalletType;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}
