import React from 'react';
import { StyleSheet, View } from 'react-native';

export const SkeletonLoader = () => {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.headerSkeleton}>
        <View style={[styles.box, { width: 80, height: 20 }]} />
        <View style={[styles.box, { width: 60, height: 24, borderRadius: 12 }]} />
      </View>

      {/* Title skeleton */}
      <View style={[styles.box, { width: '75%', height: 26, marginHorizontal: 16, marginBottom: 12 }]} />

      {/* Badges skeleton */}
      <View style={styles.badgeRow}>
        <View style={[styles.box, { width: 60, height: 22, borderRadius: 6 }]} />
        <View style={[styles.box, { width: 70, height: 22, borderRadius: 6 }]} />
        <View style={[styles.box, { width: 120, height: 22, borderRadius: 6 }]} />
      </View>

      {/* Stats card skeleton */}
      <View style={[styles.box, { height: 75, marginHorizontal: 16, borderRadius: 12, marginBottom: 12 }]} />

      {/* Judge card skeleton */}
      <View style={[styles.box, { height: 85, marginHorizontal: 16, borderRadius: 14, marginBottom: 12 }]} />

      {/* Countdown bar skeleton */}
      <View style={[styles.box, { height: 42, marginHorizontal: 16, borderRadius: 10, marginBottom: 12 }]} />

      {/* Dates grid skeleton */}
      <View style={[styles.box, { height: 130, marginHorizontal: 16, borderRadius: 12, marginBottom: 12 }]} />

      {/* Winners scroll skeleton */}
      <View style={[styles.box, { height: 60, marginHorizontal: 16, borderRadius: 12, marginBottom: 12 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
  },
  headerSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  box: {
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
});
