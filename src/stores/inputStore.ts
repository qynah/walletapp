import type { UseBoundStore } from 'zustand/react';
import type { StoreApi } from 'zustand/vanilla';
import type { StateStorage } from 'zustand/middleware';
import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import type { Input } from '@/types/input';
import { v4 as uuidv4 } from 'uuid';

import AsyncStorage from '@react-native-async-storage/async-storage';
interface InputActions {
  addInput: (input: Omit<Input, 'id'>) => string;
  editInput: (input: Input) => void;
  removeInput: (inputId: string) => void;
  getInputById: (inputId: string) => Input | undefined;
}

interface InputState {
  inputs: Input[];
  actions: InputActions;
}

const initialState: Omit<InputState, 'actions'> = {
  inputs: [],
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

export const useInputStore: UseBoundStore<StoreApi<InputState>> = create(
  persist(
    set => ({
      ...initialState,
      actions: {
        addInput: (input: Omit<Input, 'id'>) => {
          const newInputId = uuidv4();
          set(state => ({
            ...state,
            inputs: [
              ...state.inputs,
              {
                ...input,
                id: newInputId,
                amount: +input.amount,
                // createdAt: new Date().toISOString(),
                // updatedAt: new Date().toISOString(),
              },
            ],
          }));

          return newInputId;
        },
        editInput: (input: Input) => {
          set(state => ({
            ...state,
            inputs: state.inputs.map(r =>
              r.id === input.id
                ? {
                    ...r,
                    ...input,
                    amount: +input.amount,
                    updatedAt: new Date().toISOString(),
                  }
                : r
            ),
          }));
        },
        removeInput: (inputId: string) => {
          set(state => ({
            ...state,
            wallets: state.inputs.filter(input => input.id !== inputId),
          }));
        },
        getInputById: inputId => {
          const state = useInputStore.getState();
          const input = state.inputs.find(cat => cat.id === inputId);
          return input ?? undefined;
        },
      },
    }),
    {
      name: 'input-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['actions'].includes(key))
        ),
    }
  )
);

export const useInputActions = () => useInputStore(state => state.actions);
