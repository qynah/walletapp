import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default function ReportScreen() {
  return (
    <View style={{ marginTop: 30 }}>
      <Text>Thống kê thu chi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
