import React, { useState } from 'react';
import { TextInput, StyleSheet, Pressable, Keyboard } from 'react-native';
import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import { Ionicons } from '@expo/vector-icons';
import type { Wallet, WalletType } from '@/types/wallet';
import { useRouter } from 'expo-router';
import { CustomHeader } from '@/components/common/CustomHeader/CustomHeader';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/components/common/Button';
import { useWalletActions } from '@/stores/walletStore';

type FormData = Omit<Wallet, 'id'>;
const walletTypeOptions: Record<WalletType, string> = {
  cash: 'Tiền mặt',
  bank: 'Ngân hàng',
  'e-wallet': 'Ví điện tử',
  credit: 'Thẻ tín dụng',
  savings: 'Tiết kiệm',
};

export default function AddWalletScreen() {
  // const [name, setName] = useState('');
  // const [balance, setBalance] = useState('');
  const [selectedType, setSelectedType] = useState<WalletType>('cash');
  const [showDropdown, setShowDropdown] = useState(false);

  const { addWallet } = useWalletActions();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      budget: 0,
      currentBalance: 0,
      totalExpenditure: 0,
      totalInCome: 0,
      type: 'cash',
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
  const onSubmit = (data: FormData) => {
    try {
      const newId = addWallet(data);
      alert(`Đã tạo ví mới: ${newId}, chi tiết: ${JSON.stringify(data)}`);
      reset();
    } catch (error) {
      console.error('Lỗi khi tạo ví mới: ', error);
      alert('Có lỗi xảy ra khi thêm dữ liệu, vui lòng thử lại.');
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        if (showDropdown) setShowDropdown(false);
      }}
    >
      <Box padding={16} gap={12} height={'100%'}>
        <Box gap={10}>
          <Text fontSize={16} fontWeight="bold">
            Tên ví
          </Text>
          <Controller
            control={control}
            name="name"
            defaultValue="Ví của tôi"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Nhập tên ví..."
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Box>

        <Box gap={10}>
          <Text fontSize={16} fontWeight="bold">
            Ngân sách ban đầu
          </Text>
          <Box flexDirection="row" alignItems="center">
            <Controller
              control={control}
              name="budget"
              defaultValue={0}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.inputMoney}
                  onChangeText={onChange}
                  value={value + ''}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              )}
            />

            <Text fontWeight="bold" style={styles.labelMoney}>
              đ
            </Text>
          </Box>
        </Box>

        <Box gap={10} position="relative">
          <Text fontSize={16} fontWeight="bold">
            Loại ví
          </Text>
          <Pressable
            onPress={() => setShowDropdown(prev => !prev)}
            style={styles.dropdownToggle}
          >
            <Text>{walletTypeOptions[selectedType]}</Text>
            <Ionicons
              name={showDropdown ? 'chevron-up' : 'chevron-down'}
              size={20}
            />
          </Pressable>

          {showDropdown && (
            <Box
              style={styles.dropdown}
              position="absolute"
              width={'100%'}
              top={76}
              zIndex={10}
            >
              {Object.entries(walletTypeOptions).map(([value, label]) => (
                <Pressable
                  key={value as WalletType}
                  onPress={() => {
                    setSelectedType(value as WalletType);
                    setValue('type', value as WalletType);
                    setShowDropdown(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text>{label}</Text>
                </Pressable>
              ))}
            </Box>
          )}
        </Box>

        <Box marginTop={10}>
          <Button text={'Thêm ví'} onPress={handleSubmit(onSubmit)}></Button>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 40,
  },
  dropdownToggle: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    padding: 10,
  },
  addBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    minHeight: 60,
    paddingVertical: 4,
  },
  inputMoney: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(186, 220, 196, 0.5)',
  },
  labelMoney: {
    // backgroundColor: 'red',

    marginHorizontal: 10,
    fontSize: 16,
  },
});
