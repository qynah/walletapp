export interface Input {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  note?: string;
  walletId: string;
  walletName?: string;
  categoryId: string;
  categoryName?: string;
  categoryIcon?: string;
  categoryIconColor?: string;
  createdAt: string;
  updatedAt: string;
}
