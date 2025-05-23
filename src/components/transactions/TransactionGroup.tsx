import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import dayjs from 'dayjs';
import React from 'react';
import TransactionItem from './TransactionItem';

const TransactionGroup = ({ group, colors }: { group: any; colors: any }) => {
  return (
    <Box
      marginTop={20}
      gap={6}
      borderWidth={1}
      borderColor={'#ccc'}
      borderRadius={8}
      overflow="hidden"
    >
      <Box
        backgroundColor={colors.border2}
        padding={4}
        flexDirection="row"
        justifyContent="space-between"
      >
        <Text fontSize={14}>{dayjs(group.date).format('DD/MM/YYYY')}</Text>
        <Box flexDirection="row" justifyContent="space-between" gap={10}>
          <Text fontSize={14} color={colors.error}>
            Tổng chi: - {group.totalExpense || 0}{' '}
          </Text>
          <Text fontSize={14} color={colors.green}>
            Tổng thu: {group.totalIncome || 0}
          </Text>
        </Box>
      </Box>

      {group.items.map((trans: any, index: number) => (
        <TransactionItem
          key={index}
          trans={trans}
          isLast={index === group.items.length - 1}
        />
      ))}
    </Box>
  );
};

export default TransactionGroup;
