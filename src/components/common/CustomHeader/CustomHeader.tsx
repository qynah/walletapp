import React from 'react';
// import { Colors } from '@/constants/Colors';
// import { FontSizes } from '@/constants/Fonts';
import { Pressable, StyleSheet, Text, View } from 'react-native';
// import { useColorScheme } from '@/hooks/useColorScheme';
import { useTheme } from '@react-navigation/native';
export function CustomHeader({
  leftTitle,
  rightTitle,
  active,
  onChange,
}: {
  leftTitle: string;
  rightTitle: string;
  active: 'left' | 'right';
  onChange: (value: 'left' | 'right') => void;
}) {
  const { colors } = useTheme();
  //   const colorScheme = useColorScheme();
  //   const colors = Colors[colorScheme ?? 'light'];
  return (
    <View style={styles.header}>
      <View style={styles.changeTabs}>
        <Pressable
          style={[
            styles.button,
            active === 'left' && {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={() => onChange('left')}
        >
          <Text style={[styles.text, active === 'left' && styles.activeText]}>
            {leftTitle}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            active === 'right' && {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={() => onChange('right')}
        >
          <Text style={[styles.text, active === 'right' && styles.activeText]}>
            {rightTitle}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    // fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  button: {
    // flex: 1,
    width: 100,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  changeTabs: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
  },
});
