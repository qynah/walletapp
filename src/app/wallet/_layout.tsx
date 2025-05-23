import React from 'react';
import { Stack } from 'expo-router';

export default function WalletLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="add-wallet"
        options={{ headerShown: true, title: 'Tạo ví mới' }}
      />
      <Stack.Screen
        name="edit-wallet"
        options={{ headerShown: true, title: 'Sửa thông tin ví' }}
      />
    </Stack>
  );
}
