import type { UseBoundStore } from 'zustand/react';
import type { StoreApi } from 'zustand/vanilla';
import type { StateStorage } from 'zustand/middleware';
import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import type { Wallet } from '@/types/wallet';
import { v4 as uuidv4 } from 'uuid';

import AsyncStorage from '@react-native-async-storage/async-storage';
interface WalletActions {
  addWallet: (wallet: Omit<Wallet, 'id'>) => string;
  editWallet: (wallet: Wallet) => void;
  removeWallet: (walletId: string) => void;
  getWalletById: (walletId: string) => Wallet | undefined;
}

interface WalletState {
  wallets: Wallet[];
  actions: WalletActions;
}

const initialState: Omit<WalletState, 'actions'> = {
  wallets: [],
};

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return AsyncStorage.setItem(name, value);
  },
  getItem: name => {
    return AsyncStorage.getItem(name) ?? null;
  },
  removeItem: name => {
    return AsyncStorage.removeItem(name);
  },
};

export const useWalletStore: UseBoundStore<StoreApi<WalletState>> = create(
  persist(
    set => ({
      ...initialState,
      actions: {
        addWallet: (wallet: Omit<Wallet, 'id'>) => {
          const newWalletId = uuidv4();
          set(state => ({
            ...state,
            wallets: [
              ...state.wallets,
              {
                ...wallet,
                id: newWalletId,
                budget: +wallet.budget,
                currentBalance: +wallet.budget,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          }));

          return newWalletId;
        },
        editWallet: (wallet: Wallet) => {
          set(state => ({
            ...state,
            wallets: state.wallets.map(r =>
              r.id === wallet.id
                ? {
                    ...r,
                    ...wallet,
                    budget: +wallet.budget,
                    currentBalance:
                      +wallet.budget +
                      +wallet.totalInCome -
                      +wallet.totalExpenditure,
                    updatedAt: new Date().toISOString(),
                  }
                : r
            ),
          }));
        },
        removeWallet: (walletId: string) => {
          set(state => ({
            ...state,
            wallets: state.wallets.filter(wallet => wallet.id !== walletId),
          }));
        },
        getWalletById: walletId => {
          const state = useWalletStore.getState();
          const wallet = state.wallets.find(cat => cat.id === walletId);
          return wallet ?? undefined;
        },
      },
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['actions'].includes(key))
        ),
    }
  )
);

export const useWalletActions = () => useWalletStore(state => state.actions);
