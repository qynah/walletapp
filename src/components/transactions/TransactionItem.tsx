import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import type { Input } from '@/types/input';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import React from 'react';

type Props = {
  trans: any;
  isLast: boolean;
};

const TransactionItem = ({ trans, isLast }: Props) => {
  const { colors } = useTheme();
  const handleDetailInput = (inputItem: Input) => {
    router.push({
      pathname: '/incomeAndExpense/detail-input',
      params: { id: inputItem.id },
    });
  };
  return (
    <Box
      onPress={() => handleDetailInput(trans)}
      borderBottomWidth={isLast ? 0 : 1}
      borderBottomColor={'#FAF6F3'}
      paddingX={8}
      paddingY={8}
      borderRadius={8}
    >
      {trans.walletName && (
        <Box marginBottom={8}>
          <Text fontWeight="bold" fontSize={14} color={colors.border}>
            {trans.walletName}
          </Text>
        </Box>
      )}

      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box width={'30%'} flexDirection="row" alignItems="center" gap={8}>
          <FontAwesome
            name={trans.categoryIcon as any}
            size={20}
            color={trans.categoryIconColor || '#000'}
          />
          <Text fontSize={16} fontWeight="semibold">
            {trans.categoryName}
          </Text>
        </Box>
        <Box
          width={'70%'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          gap={10}
        >
          <Box flex={1}>
            {trans.note && <Text numberOfLines={3}>({trans.note})</Text>}
          </Box>
          <Box flexShrink={0}>
            {trans.type === 'expense' ? (
              <Text color={'red'} fontWeight="bold" fontSize={16}>
                - {trans.amount} đ
              </Text>
            ) : (
              <Text color={'green'} fontWeight="bold" fontSize={16}>
                {trans.amount} đ
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TransactionItem;
