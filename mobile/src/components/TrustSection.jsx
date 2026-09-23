import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const TrustSection = ({ t, onWatchPrizeVideo }) => {
  return (
    <View style={styles.container}>
      {/* Left Column: Prize Money Video */}
      <TouchableOpacity style={styles.leftColumn} onPress={onWatchPrizeVideo} activeOpacity={0.8}>
        <View style={styles.playIconContainer}>
          <Ionicons name="play" size={14} color="#006D63" style={{ marginLeft: 2 }} />
        </View>
        <View style={styles.leftTextContainer}>
          <Text style={styles.prizeMoneyTitle}>{t.prizeMoneyTitle}</Text>
          <Text style={styles.prizeMoneySub}>{t.prizeMoneySubtitle}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Right Column: Refund & Razorpay Trust */}
      <View style={styles.rightColumn}>
        <View style={styles.trustItem}>
          <Feather name="shield" size={13} color="#475569" />
          <Text style={styles.trustItemText}>{t.refundPolicy}</Text>
        </View>

        <View style={styles.trustItem}>
          <Feather name="shield" size={13} color="#475569" />
          <Text style={styles.trustItemText}>
            {t.securePayments} <Text style={styles.razorpayBrand}>Razorpay</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  leftColumn: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftTextContainer: {
    flex: 1,
  },
  prizeMoneyTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 15,
  },
  prizeMoneySub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
  },
  rightColumn: {
    flex: 1.1,
    gap: 8,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustItemText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  razorpayBrand: {
    fontWeight: '800',
    color: '#0C2340',
  },
});
