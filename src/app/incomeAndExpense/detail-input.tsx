import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';
import { useInputActions, useInputStore } from '@/stores/inputStore';
import { router, useLocalSearchParams } from 'expo-router';
import type { Input } from '@/types/input';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import dayjs from 'dayjs';
import Button from '@/components/common/Button';

export default function DetailInputScreen() {
  const { id } = useLocalSearchParams();
  const { getInputById } = useInputActions();
  const allInputs = useInputStore(state => state.inputs);
  const handleEditInput = (inputItem: Input) => {
    router.push({
      pathname: '/incomeAndExpense/edit-detail-input',
      params: { id: inputItem.id },
    });
  };
  const [walletItem, setWalletItem] = useState<Input>();
  useEffect(() => {
    setWalletItem(getInputById(`${id}`));
  }, [id, allInputs]);

  const { colors } = useTheme();
  return walletItem ? (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Box
        margin={10}
        padding={10}
        borderWidth={1}
        borderColor={colors.border2}
        gap={16}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box
            flexDirection="row"
            alignItems="center"
            gap={walletItem.categoryIcon ? 10 : 0}
          >
            {walletItem.categoryIcon && (
              <FontAwesome
                name={walletItem.categoryIcon as any}
                size={20}
                color={walletItem.categoryIconColor || '#000'}
              />
            )}
            <Text fontSize={16} fontWeight="semibold">
              {walletItem.categoryName
                ? walletItem.categoryName
                : 'Chưa phân loại'}
            </Text>
          </Box>
          <Box flexDirection="row" gap={6}>
            <Text color={walletItem.type === 'expense' ? 'red' : 'green'}>
              {walletItem.type === 'expense'
                ? -walletItem.amount
                : walletItem.amount}
            </Text>
            <Text color={walletItem.type === 'expense' ? 'red' : 'green'}>
              đ
            </Text>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexDirection="row" gap={10} alignItems="center">
            <Text fontSize={16} fontWeight="semibold">
              Ví
            </Text>
          </Box>
          <Box>
            <Text>{walletItem.walletName || 'Chưa có ví'}</Text>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexDirection="row" gap={10} alignItems="center">
            <Text fontSize={16} fontWeight="semibold">
              Loại tiền
            </Text>
          </Box>
          <Box>
            <Text>
              {walletItem.type === 'expense'
                ? 'Khoản chi tiêu'
                : 'Khoản thu nhập'}
            </Text>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexDirection="row" gap={10} alignItems="center">
            <Text fontSize={16} fontWeight="semibold">
              Ngày{' '}
              {walletItem.createdAt !== walletItem.updatedAt ? 'sửa' : 'tạo'}
            </Text>
          </Box>
          <Box>
            <Text>
              {dayjs(
                walletItem.createdAt !== walletItem.updatedAt
                  ? walletItem.updatedAt
                  : walletItem.createdAt
              ).format('DD/MM/YYYY HH:mm')}
            </Text>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flexDirection="row" gap={10} alignItems="center">
            <Text fontSize={16} fontWeight="semibold">
              Ghi chú
            </Text>
          </Box>
          <Box>
            <Text>{walletItem?.note}</Text>
          </Box>
        </Box>
        <Box>
          <Button
            text={'Chỉnh sửa'}
            onPress={() => handleEditInput(walletItem)}
          ></Button>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  ) : (
    <Box>
      <Text> Lỗi tải trang...</Text>
    </Box>
  );
}
