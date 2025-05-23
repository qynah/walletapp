import { useTheme } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import type { Dispatch, SetStateAction } from 'react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ColorValue,
  Dimensions,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Box } from '../common/Layout/Box';
import Button from '../common/Button';
import CustomDropdown from '../common/CustomDropdown/CustomDropdown';
import { useInputActions, useInputStore } from '@/stores/inputStore';
import type { Input } from '@/types/input';
import { Controller, useForm } from 'react-hook-form';
import { useLocalSearchParams } from 'expo-router';
import SelectBox from '../common/SelectBox/SelectBox';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../common/Text/Text';
import { useWalletActions, useWalletStore } from '@/stores/walletStore';
import type { Wallet } from '@/types/wallet';
import { WalletType } from '@/types/wallet';
const incomeCategories = [
  { id: 'income-1', iconName: 'money', iconColor: 'green', name: 'Lương' },
  { id: 'income-2', iconName: 'gift', iconColor: 'red', name: 'Thưởng' },
  {
    id: 'income-3',
    iconName: 'shopping-cart',
    iconColor: '#3B8BED',
    name: 'Bán hàng online',
  },
  {
    id: 'income-4',
    iconName: 'line-chart',
    iconColor: '#ED783B',
    name: 'Đầu tư',
  },
  {
    id: 'income-5',
    iconName: 'handshake-o',
    iconColor: '#6333F0',
    name: 'Thu nợ',
  },
  { id: 'income-6', iconName: 'pencil', iconColor: 'gray', name: 'Chỉnh sửa' },
];
const expenseCategories = [
  {
    id: 'expense-1',
    iconName: 'cutlery',
    iconColor: '#ED783B',
    name: 'Ăn uống',
  },
  { id: 'expense-2', iconName: 'bus', iconColor: '#6333F0', name: 'Đi lại' },
  { id: 'expense-3', iconName: 'home', iconColor: '#2EC927', name: 'Nhà cửa' },
  { id: 'expense-4', iconName: 'book', iconColor: '#3B8BED', name: 'Giáo dục' },
  {
    id: 'expense-5',
    iconName: 'shopping-bag',
    iconColor: '#F0BC7D',
    name: 'Mua sắm',
  },
  { id: 'expense-6', iconName: 'film', iconColor: '#E2A5F0', name: 'Giải trí' },
  { id: 'expense-7', iconName: 'pencil', iconColor: 'gray', name: 'Chỉnh sửa' },
  { id: 'expense-8', iconName: 'bus', iconColor: '#6333F0', name: 'Đi lại' },
  { id: 'expense-9', iconName: 'home', iconColor: '#2EC927', name: 'Nhà cửa' },
  {
    id: 'expense-10',
    iconName: 'book',
    iconColor: '#3B8BED',
    name: 'Giáo dục',
  },
  {
    id: 'expense-11',
    iconName: 'shopping-bag',
    iconColor: '#F0BC7D',
    name: 'Mua sắm',
  },
  {
    id: 'expense-12',
    iconName: 'film',
    iconColor: '#E2A5F0',
    name: 'Giải trí',
  },
  {
    id: 'expense-13',
    iconName: 'pencil',
    iconColor: 'gray',
    name: 'Chỉnh sửa',
  },
];

type FontAwesomeIconName = React.ComponentProps<typeof FontAwesome>['name'];
type Category = {
  id: string;
  iconName: string;
  iconColor: string;
  name: string;
};

type FormData = Input;
const CategoryList = memo(
  ({
    data,
    selectedId,
    onSelect,
  }: {
    data: Category[];
    selectedId: string | null;
    onSelect: (
      id: string,
      name: string,
      icon: string,
      iconColor: string
    ) => void;
  }) => {
    const numColumns = 3;
    const screenWidth = Dimensions.get('window').width - 20;
    const itemWidth = screenWidth / 3 - 8;
    const renderItem = ({ item }: { item: Category }) => {
      const isSelected = item.id === selectedId;

      return (
        <Pressable
          style={[
            styles.categoryItem,
            isSelected && styles.selectedItem,
            { width: itemWidth },
          ]}
          onPress={() =>
            onSelect(item.id, item.name, item.iconName, item.iconColor)
          }
        >
          <FontAwesome
            name={item.iconName as any}
            size={20}
            color={item.iconColor}
          />
          <Text
            numberOfLines={1}
            style={[styles.categoryText, isSelected && styles.selectedText]}
          >
            {item.name}
          </Text>
        </Pressable>
      );
    };

    return (
      <View style={{ maxHeight: 370 }}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          numColumns={numColumns}
          contentContainerStyle={styles.containerCategory}
          showsVerticalScrollIndicator={true}
        />
      </View>
    );
  }
);

CategoryList.displayName = 'CategoryList';

export default CategoryList;
export function EditIncomeAndExpense({
  active,
  setActive,
}: {
  active: 'left' | 'right';
  setActive: Dispatch<SetStateAction<'left' | 'right'>>;
}) {
  const [text, setText] = useState('');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const { editInput, getInputById } = useInputActions();
  const screenHeight = Dimensions.get('window').height - 20;
  const { colors } = useTheme();
  const handleTextChange = useCallback((val: string) => setText(val), []);
  const handleNumberChange = useCallback((val: string) => setNumber(val), []);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const { editWallet, getWalletById } = useWalletActions();
  // const [type, setType] = useState(active === 'left' ? 'expense' : 'income');

  const allInputs = useInputStore(state => state.inputs);
  const allWallets = useWalletStore(state => state.wallets);

  const { id } = useLocalSearchParams();
  useEffect(() => {
    setValue('type', active === 'left' ? 'expense' : 'income');
  }, [active]);

  const categories = active === 'left' ? expenseCategories : incomeCategories;
  const handleChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      const isoDate = selectedDate.toISOString();
      updateValue('createdAt', isoDate);
      updateValue('updatedAt', isoDate);
    }
    // setShow(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      id: id as string,
      type: 'expense',
      amount: 0,
      note: '',
      walletId: '',
      walletName: '',
      categoryId: '',
      categoryName: '',
      categoryIcon: '',
      categoryIconColor: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  const updateValue = (key: any, value: string | number) => {
    setValue(key, value);
  };

  const handleWalletChange = (option: any) => {
    setValue('walletId', option.id);
    setValue('walletName', option.label);
  };
  const onCategorySelect = (
    id: string,
    name: string,
    icon: string,
    iconColor: string
  ) => {
    setSelectedCategoryId(id);
    updateValue('categoryId', id);
    updateValue('categoryName', name);
    updateValue('categoryIcon', icon);
    updateValue('categoryIconColor', iconColor);
  };
  const formDataToObject = (formData: FormData): Record<string, any> => {
    const obj: Record<string, any> = {};
    for (const [key, value] of formData as any) {
      obj[key] = value;
    }
    return obj;
  };
  const onSubmit = (data: FormData) => {
    try {
      const newId = editInput(data);
      alert(
        `Đã thêm input mới với id: ${newId}, chi tiết: ${JSON.stringify(data)}`
      );
      reset();
    } catch (error) {
      console.error('Lỗi khi thêm input:', error);
      alert('Có lỗi xảy ra khi thêm dữ liệu, vui lòng thử lại.');
    }
  };
  const [filterWalletName, setFilterWalletName] = useState('');
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  const walletNames = useMemo(() => {
    const names = new Set(allWallets.map(item => item.name).filter(Boolean));
    return Array.from(names);
  }, [allWallets]);

  useEffect(() => {
    const inputItem = getInputById(`${id}`);
    if (inputItem) {
      setValue('createdAt', inputItem.createdAt || '');
      setValue('note', inputItem.note || '');
      setValue('amount', inputItem.amount || 0);
      setValue('walletId', inputItem.walletId || '');
      setValue('walletName', inputItem.walletName || '');
      setValue('categoryId', inputItem.categoryId || '');
      setValue('categoryIcon', inputItem.categoryIcon || '');
      setValue('categoryIconColor', inputItem.categoryIconColor || '');
      setValue('type', inputItem.type || '');
      setSelectedCategoryId(inputItem.categoryId);
      setFilterWalletName(inputItem.walletName || '');
      setDate(inputItem.createdAt ? new Date(inputItem.createdAt) : new Date());
      setActive(inputItem.type === 'income' ? 'right' : 'left');
    }
  }, [id]);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        if (showWalletDropdown) setShowWalletDropdown(false);
      }}
    >
      <Box style={styles.container}>
        <Box style={styles.itemInput}>
          <Text fontWeight="bold" style={styles.label}>
            Ngày
          </Text>
          <Pressable>
            <Text color={colors.text} fontSize={16}>
              {dayjs(date).format('DD/MM/YYYY')}
            </Text>
          </Pressable>
          <Box marginLeft={10} onPress={() => setShow(true)}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={colors.primary}
            />
          </Box>

          {show && Platform.OS === 'android' && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleChange}
            />
          )}

          {Platform.OS === 'ios' && (
            <Modal transparent visible={show} animationType="fade">
              <Box style={styles.modalContainer}>
                <Box style={styles.pickerContainer}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={handleChange}
                  />
                  <Pressable
                    onPress={() => setShow(false)}
                    style={styles.doneButton}
                  >
                    <Text style={{ color: 'blue', fontWeight: 'bold' }}>
                      Xong
                    </Text>
                  </Pressable>
                </Box>
              </Box>
            </Modal>
          )}
        </Box>
        <Box style={styles.itemInput}>
          <Text fontWeight="bold" style={styles.label}>
            Ghi chú
          </Text>
          <Controller
            control={control}
            name="note"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Nhập ghi chú..."
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Box>

        <Box style={styles.itemInput}>
          <Text fontWeight="bold" style={styles.label}>
            Tiền {active === 'left' ? 'chi' : 'thu'}
          </Text>
          <Controller
            control={control}
            name="amount"
            defaultValue={0}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.inputMoney}
                placeholder="Nhập số tiền..."
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

        <Box style={styles.itemInput}>
          <Text fontWeight="bold" style={styles.label}>
            Tên ví
          </Text>
          <Box position="relative">
            <SelectBox
              value={filterWalletName}
              placeholder="Tất cả ví"
              onPress={() => setShowWalletDropdown(prev => !prev)}
            />

            {showWalletDropdown && (
              <Box
                style={{
                  position: 'absolute',
                  top: 45,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  width: '100%',
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  padding: 8,
                  backgroundColor: '#fafafa',
                  marginBottom: 12,
                }}
              >
                <Pressable
                  onPress={() => {
                    setFilterWalletName('');
                    setShowWalletDropdown(false);
                  }}
                ></Pressable>
                {walletNames.map((walletName: any) => (
                  <Pressable
                    key={walletName}
                    onPress={() => {
                      setFilterWalletName(walletName);
                      updateValue('walletName', walletName);
                      setShowWalletDropdown(false);
                    }}
                  >
                    <Text style={{ paddingVertical: 6 }}>{walletName}</Text>
                  </Pressable>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box style={styles.itemCategories}>
          <Text fontWeight="bold" style={styles.label}>
            Danh mục
          </Text>
          <CategoryList
            data={categories}
            selectedId={selectedCategoryId}
            onSelect={onCategorySelect}
            // onUpdate={updateValue}
          />
        </Box>
        <Box position="absolute" bottom={200} right={0} left={0} marginX={10}>
          <Button
            text={`Lưu khoản ${active === 'left' ? 'chi' : 'thu'}`}
            onPress={handleSubmit(onSubmit)}
          ></Button>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    position: 'relative',
    height: Dimensions.get('window').height,
  },

  itemInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    minHeight: 60,
    paddingVertical: 4,
  },
  itemCategories: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    minHeight: 60,
    marginVertical: 8,
  },
  label: {
    width: 80,
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    flex: 1,
    // height: 40 ,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputNote: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,

    backgroundColor: 'rgba(186, 220, 196, 0.5)',
    fontSize: 16,
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
  containerCategory: {
    marginTop: 10,
  },
  categoryItem: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    gap: 8,
    margin: 4,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  doneButton: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  customButton: {
    paddingVertical: 10,
    fontSize: 16,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(186, 220, 196, 0.5)',
  },
  submitButton: {
    paddingVertical: 10,
    // backgroundColor: Colors.light.primaryColor,
    fontSize: 16,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 60,
  },
  customButtonText: {
    // fontSize: 16,
  },
  selectedItem: {
    // backgroundColor: Colors.light.primaryColor,

    // backgroundColor: '#F0E1D5',
    borderColor: '#777',
    borderWidth: 1.2,
  },
  selectedText: {},
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectWallet: {},
});
