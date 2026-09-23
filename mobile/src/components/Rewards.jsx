import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/currency';
import { colors } from '../theme/colors';

export const Rewards = ({ rewards = [], currency = 'INR', t }) => {
  if (!rewards || rewards.length === 0) return null;

  const renderRewardIcon = (position) => {
    switch (position) {
      case 1:
        return <Ionicons name="trophy" size={20} color="#F59E0B" />; // Gold
      case 2:
        return <Ionicons name="medal" size={20} color="#0284C7" />;  // Blue/Silver
      case 3:
        return <Ionicons name="medal" size={20} color="#D97706" />;  // Bronze
      default:
        return <Ionicons name="star-outline" size={18} color="#0D9488" />; // Teal star
    }
  };

  const getPositionLabel = (pos) => {
    if (pos === 1) return t.firstWinner || '1st Winner';
    if (pos === 2) return t.secondWinner || '2nd Winner';
    if (pos === 3) return t.thirdWinner || '3rd Winner';
    return `${pos}th Winner`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t.rewardsAllPositions}</Text>

      <View style={styles.card}>
        {rewards.map((reward, index) => (
          <View
            key={index}
            style={[
              styles.rewardRow,
              index < rewards.length - 1 && styles.rowBorder,
            ]}
          >
            <View style={styles.left}>
              <View style={styles.iconContainer}>{renderRewardIcon(reward.position)}</View>
              <Text style={styles.positionText}>{reward.title || getPositionLabel(reward.position)}</Text>
            </View>

            <Text style={styles.amountText}>{formatCurrency(reward.amount, currency)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#007A6E', // Green/Teal
  },
});
