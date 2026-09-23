import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const AdBanner = ({ t }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="bullhorn-outline" size={15} color="#475569" />
      <Text style={styles.text}>{t.adHere || 'Ad Here'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
});
