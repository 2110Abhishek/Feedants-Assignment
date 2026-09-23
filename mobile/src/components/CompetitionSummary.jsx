import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/currency';

export const CompetitionSummary = ({ competition, isRegistered, t }) => {
  if (!competition) return null;

  const spotsRemaining = competition.spotsRemaining ?? (competition.capacity - competition.registeredCount);
  const registeredCount = competition.registeredCount || 0;
  const capacity = competition.capacity || 20;
  const progressRatio = Math.min(1, registeredCount / capacity);

  return (
    <View style={styles.cardContainer}>
      {/* Top Row: Title + Registered Badge (Matching Reference Screenshot) */}
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {competition.title}
        </Text>

        {isRegistered && (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark-circle" size={13} color="#00897B" />
            <Text style={styles.registeredBadgeText}>{t.registered || 'Registered'}</Text>
          </View>
        )}
      </View>

      {/* Badges Row */}
      <View style={styles.badgeRow}>
        <View style={styles.tagPill}>
          <Text style={styles.tagText}>{t.dance || competition.category || 'Dance'}</Text>
        </View>
        <View style={styles.tagPill}>
          <Text style={styles.tagText}>
            {competition.mode === 'MULTI_WIN' ? (t.multiWin || 'Multi-Win') : 'Single-Win'}
          </Text>
        </View>
        {competition.winnerCertificate && (
          <View style={styles.certificateTag}>
            <Ionicons name="trophy-outline" size={14} color="#00897B" />
            <Text style={styles.certificateText}>{t.winnersCertificate || 'Winners get certificate'}</Text>
          </View>
        )}
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {/* Prize Pool */}
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>{t.prizePool || 'Prize Pool'}</Text>
          <Text style={styles.prizeAmount}>{formatCurrency(competition.prizePool, competition.currency)}</Text>
        </View>

        {/* Entry Fee */}
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>{t.entryFee || 'Entry Fee'}</Text>
          <Text style={styles.feeAmount}>{formatCurrency(competition.entryFee, competition.currency)}</Text>
        </View>

        {/* Spots Remaining */}
        <View style={[styles.statColumn, styles.spotsColumn]}>
          <View style={styles.spotsHeader}>
            <Ionicons name="people-outline" size={14} color="#00897B" />
            <Text style={styles.spotsText}>
              {t.onlySpotsLeft ? t.onlySpotsLeft.replace('{count}', spotsRemaining) : `Only ${spotsRemaining} spots left`}
            </Text>
          </View>
          {/* Progress Bar */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.max(5, progressRatio * 100)}%` }]} />
          </View>
          <Text style={styles.bookedText}>
            {t.spotsBooked
              ? t.spotsBooked.replace('{booked}', registeredCount).replace('{capacity}', capacity)
              : `${registeredCount} / ${capacity} Booked`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2F1', // Soft mint as in reference
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  registeredBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00796B',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  certificateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  certificateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00897B',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  statColumn: {
    flex: 1,
  },
  spotsColumn: {
    flex: 1.3,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 3,
  },
  prizeAmount: {
    fontSize: 19,
    fontWeight: '800',
    color: '#007A6E',
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  spotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  spotsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007A6E',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 3,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#00897B',
    borderRadius: 2,
  },
  bookedText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
});
