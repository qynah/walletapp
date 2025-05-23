import { CustomHeader } from '@/components/common/CustomHeader/CustomHeader';
import { AddIncomeAndExpense } from '@/components/incomeAndExpense/AddIncomeAndExpense';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export default function AddMoneyScreen() {
  const [active, setActive] = useState<'left' | 'right'>('left');
  useFocusEffect(
    useCallback(() => {
      setActive('left');
    }, [])
  );

  return (
    <View>
      <CustomHeader
        leftTitle="Tiền chi"
        rightTitle="Tiền thu"
        active={active}
        onChange={setActive}
      />
      <AddIncomeAndExpense active={active} />
    </View>
  );
}
