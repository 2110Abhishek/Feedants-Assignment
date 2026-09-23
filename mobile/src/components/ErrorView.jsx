import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const ErrorView = ({ error, onRetry }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="cloud-offline-outline" size={36} color="#DC2626" />
      </View>
      <Text style={styles.title}>Unable to load competition</Text>
      <Text style={styles.message}>
        {error?.message || 'Something went wrong while loading this competition.'}
      </Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
        <Ionicons name="refresh" size={16} color="#FFFFFF" />
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 280,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#005C53',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
