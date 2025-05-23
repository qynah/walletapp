import { Box } from '@/components/common/Layout/Box';
import SelectBox from '@/components/common/SelectBox/SelectBox';
import { Text } from '@/components/common/Text/Text';
import TransactionGroup from '@/components/transactions/TransactionGroup';
import WalletSummary from '@/components/wallets/WalletSummary';
import { useInputStore } from '@/stores/inputStore';
import { useWalletStore } from '@/stores/walletStore';
import { useTheme } from '@react-navigation/native';

import dayjs from 'dayjs';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList } from 'react-native';
const groupByDate = (data: any[]) => {
  const grouped: {
    [date: string]: {
      items: any[];
      totalIncome: number;
      totalExpense: number;
    };
  } = {};

  data.forEach(item => {
    const dateKey = dayjs(item.createdAt).format('YYYY-MM-DD');
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        items: [],
        totalIncome: 0,
        totalExpense: 0,
      };
    }

    grouped[dateKey].items.push(item);

    if (item.type === 'income') {
      grouped[dateKey].totalIncome += +item.amount;
    } else if (item.type === 'expense') {
      grouped[dateKey].totalExpense += +item.amount;
    }
  });

  return Object.entries(grouped)
    .sort((a, b) => dayjs(b[0]).valueOf() - dayjs(a[0]).valueOf())
    .map(([date, { items, totalIncome, totalExpense }]) => ({
      date,
      items,
      totalIncome,
      totalExpense,
    }));
};

export default function HomeScreen() {
  const allWallets = useWalletStore(state => state.wallets);
  const allInputs = useInputStore(state => state.inputs);

  const [filterWalletName, setFilterWalletName] = useState('');
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  const filteredInputs = useMemo(() => {
    return allInputs.filter(
      item => filterWalletName === '' || item.walletName === filterWalletName
    );
  }, [allInputs, filterWalletName]);

  const selectedWallet = useMemo(() => {
    return allWallets.find(w => w.name === filterWalletName);
  }, [filterWalletName, allWallets]);

  const groupedData = useMemo(
    () => groupByDate(filteredInputs),
    [filteredInputs]
  );
  const { colors } = useTheme();
  return (
    <Box
      marginX={8}
      backgroundColor={colors.background}
      flex={1}
      marginBottom={90}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        gap={10}
        justifyContent="space-between"
        marginY={10}
      >
        <Text fontSize={16} fontWeight="bold" color={colors.primary}>
          Chọn loại ví
        </Text>
        <Box flex={1} position="relative">
          <SelectBox
            value={filterWalletName}
            placeholder="Tất cả ví"
            onPress={() => setShowWalletDropdown(prev => !prev)}
          />
          {showWalletDropdown && (
            <Box
              position="absolute"
              top={45}
              zIndex={10}
              width={'100%'}
              backgroundColor={colors.background}
              borderWidth={1}
              borderColor={colors.border}
              borderRadius={8}
              overflow="hidden"
            >
              <Box
                width={'100%'}
                alignItems="center"
                borderBottomWidth={1}
                borderBottomColor={colors.border2}
                paddingY={10}
                onPress={() => {
                  setFilterWalletName('');
                  setShowWalletDropdown(false);
                }}
              >
                <Text style={{ paddingVertical: 6 }}>Tất cả ví</Text>
              </Box>
              {allWallets.map(
                (item, index) =>
                  index <= 4 && (
                    <Box
                      key={item.id}
                      width={'100%'}
                      alignItems="center"
                      borderBottomWidth={index < allWallets.length - 1 ? 1 : 0}
                      borderBottomColor={colors.border2}
                      paddingY={8}
                      onPress={() => {
                        setFilterWalletName(item.name);

                        setShowWalletDropdown(false);
                      }}
                    >
                      <Text style={{ paddingVertical: 6 }}>{item.name}</Text>
                    </Box>
                  )
              )}
              <Box
                width={'100%'}
                alignItems="center"
                // borderTopWidth={1}
                // borderTopColor={colors.border}
                paddingY={8}
                backgroundColor={'#fcfcfc'}
                onPress={() => {
                  setFilterWalletName('');
                  setShowWalletDropdown(false);
                  router.push('/(tabs)/wallets');
                }}
              >
                <Text color={colors.primary} fontWeight="bold">
                  Xem tất cả
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <WalletSummary
        walletName={filterWalletName}
        budget={selectedWallet?.budget}
        balance={selectedWallet?.currentBalance}
        totalExpense={selectedWallet?.totalExpenditure}
        totalIncome={selectedWallet?.totalInCome}
      />
      <FlatList
        data={groupedData}
        keyExtractor={item => item.date}
        renderItem={({ item }) => (
          <TransactionGroup group={item} colors={colors} />
        )}
      />
    </Box>
  );
}
