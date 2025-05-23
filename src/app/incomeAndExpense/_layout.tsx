import React from 'react';
import { Stack } from 'expo-router';

export default function IncomeAndExpenseLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="detail-input"
        options={{ headerShown: true, title: 'Thông tin chi tiết' }}
      />
      <Stack.Screen
        name="edit-detail-input"
        options={{ headerShown: false, title: 'Sửa thông tin' }}
      />
    </Stack>
  );
}
