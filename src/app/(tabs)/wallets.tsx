import { Text } from '@/components/common/Text/Text';
import { useWalletActions, useWalletStore } from '@/stores/walletStore';
import type { Wallet, WalletType } from '@/types/wallet';
import { FontAwesome } from '@expo/vector-icons';

import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const walletTypeOptions: Record<WalletType, string> = {
  cash: 'Tiền mặt',
  bank: 'Ngân hàng',
  'e-wallet': 'Ví điện tử',
  credit: 'Thẻ tín dụng',
  savings: 'Tiết kiệm',
};
export default function WalletsScreen() {
  const allWallets = useWalletStore(state => state.wallets);
  const router = useRouter();
  const { removeWallet } = useWalletActions();

  const [search, setSearch] = useState('');

  const handleEditWallet = (walletItem: Wallet) => {
    router.push({
      pathname: '/wallet/edit-wallet',
      params: { id: walletItem.id },
    });
  };

  const renderWalletItem = ({ item }: { item: any }) => (
    <View style={styles.walletItem}>
      {item.avatar && (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      )}
      <View style={styles.walletInfo}>
        <Text fontSize={16} fontWeight="bold" style={styles.walletName}>
          {item.name}
        </Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
        >
          <Text>Số dư: </Text>
          <Text
            style={styles.walletBalance}
            color={item.currentBalance <= 0 ? 'red' : 'blue'}
          >
            {item.currentBalance.toLocaleString()} đ
          </Text>
        </View>
        <Text style={styles.walletType}>
          {walletTypeOptions[item.type as WalletType]} - Tạo ngày:{' '}
          {dayjs(item.createdAt).format('DD/MM/YYYY')}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => handleEditWallet(item)}
        >
          <FontAwesome name="edit" size={20} color="#007bff" />
        </Pressable>
        <Pressable
          style={styles.iconBtn}
          onPress={() =>
            Alert.alert(
              'Xác nhận xoá',
              'Bạn có chắc chắn muốn xoá ví này không?',
              [
                {
                  text: 'Xoá',
                  onPress: () => {
                    removeWallet(item.id);
                    Alert.alert('Thành công', 'Đã xóa ví thành công', [], {
                      cancelable: true,
                    });
                  },
                  style: 'destructive',
                },
                { text: 'Huỷ', style: 'cancel' },
              ],
              { cancelable: true }
            )
          }
        >
          <FontAwesome name="trash" size={20} color="#dc3545" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm ví..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Add wallet */}
      <Pressable
        style={styles.addBtn}
        onPress={() => router.push('/wallet/add-wallet')}
      >
        <FontAwesome name="plus" size={16} color="#fff" />
        <Text style={styles.addBtnText}>Thêm ví</Text>
      </Pressable>

      {/* Wallet list */}
      <FlatList
        data={allWallets.filter(w =>
          w.name.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={renderWalletItem}
        keyExtractor={item => item.id}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
    marginBottom: 90,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: '#28a745',
    padding: 10,
    marginTop: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  walletItem: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  walletBalance: {
    color: '#007bff',
  },
  walletType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    padding: 6,
  },
});
