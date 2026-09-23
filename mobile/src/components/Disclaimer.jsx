import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const Disclaimer = ({ t }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="information-circle-outline" size={16} color="#0284C7" />
      <Text style={styles.text}>{t.disclaimer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  text: {
    fontSize: 11,
    color: '#0369A1',
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
});
