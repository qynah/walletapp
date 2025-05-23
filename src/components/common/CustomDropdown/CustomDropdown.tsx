import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';

const options = [
  { id: 1, label: 'Ví chính', value: 'an_uong' },
  { id: 2, label: 'Ví điện tử', value: 'di_lai' },
  { id: 3, label: 'Ví tiền mặt', value: 'luong' },
];

export default function CustomDropdown({ onSelect }: { onSelect: any }) {
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);

  const handleSelect = (option: any) => {
    setSelected(option);
    setVisible(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <View style={styles.container}>
      {/* Nút bấm dropdown */}
      <Pressable style={styles.dropdown} onPress={() => setVisible(true)}>
        <Text style={styles.text}>{selected ? selected.label : 'Chọn ví'}</Text>
      </Pressable>

      {/* Dropdown menu */}
      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.dropdownList}>
            {options.map(option => (
              <Pressable
                key={option.value}
                style={styles.option}
                onPress={() => handleSelect(option)}
              >
                <Text>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 50,
    // paddingHorizontal: 20,
  },
  dropdown: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    backgroundColor: 'rgba(186, 220, 196, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdownList: {
    backgroundColor: 'white',
    marginHorizontal: 40,
    borderRadius: 8,
    paddingVertical: 10,
  },
  option: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
});
