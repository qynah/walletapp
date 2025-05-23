import React from 'react';
import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import { useTheme } from '@react-navigation/native';

interface WalletSummaryProps {
  walletName: string;
  budget?: number;
  balance?: number;
  totalIncome?: number;
  totalExpense?: number;
}

export default function WalletSummary({
  walletName,
  budget = 0,
  balance = 0,
  totalIncome = 0,
  totalExpense = 0,
}: WalletSummaryProps) {
  const { colors } = useTheme();

  return (
    walletName && (
      <Box
        marginY={12}
        padding={12}
        borderRadius={8}
        backgroundColor={colors.border2}
      >
        <Text fontWeight="bold" fontSize={16}>
          {walletName}
        </Text>
        <Box marginTop={8} gap={4}>
          <Text>Ngân sách: {budget.toLocaleString()} đ</Text>
          <Text>Số dư hiện tại: {balance.toLocaleString()} đ</Text>
          <Text color="green.600">
            Tổng thu: {totalIncome.toLocaleString()} đ
          </Text>
          <Text color="red.600">
            Tổng chi: {totalExpense.toLocaleString()} đ
          </Text>
        </Box>
      </Box>
    )
  );
}
