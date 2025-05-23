import React from 'react';
import { Box } from '../Layout/Box';
import { Text } from '../Text/Text';
import type { ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

interface Props {
  value: string;
  onPress: () => void;
  styleContainer?: ViewStyle;
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
}

const SelectBox = ({
  value,
  onPress,
  styleContainer,
  placeholder = 'Select',
  label,
  isRequired,
}: Props) => {
  const { colors } = useTheme();

  return (
    <Box gap={4} style={styleContainer}>
      {label && (
        <Box flexDirection="row" gap={2}>
          <Text fontSize={14} fontWeight="bold">
            {label}
          </Text>
          {isRequired && (
            <Text fontSize={14} fontWeight="bold">
              *
            </Text>
          )}
        </Box>
      )}

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
        }}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <Text fontSize={14} color={value ? colors.text : colors.border}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} />
      </TouchableOpacity>
    </Box>
  );
};

export default SelectBox;
