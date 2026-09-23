import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { formatDate } from '../utils/date';
import { colors } from '../theme/colors';

export const ImportantDates = ({ competition, t }) => {
  if (!competition) return null;

  const regEnd = formatDate(competition.registrationEndAt);
  const subStart = formatDate(competition.submissionStartAt);
  const subEnd = formatDate(competition.submissionEndAt);
  const resultDate = formatDate(competition.resultDate);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t.importantDates}</Text>

      <View style={styles.gridCard}>
        {/* Row 1 */}
        <View style={styles.gridRow}>
          {/* Item 1: Register Before */}
          <View style={[styles.gridCell, styles.cellBorderRight, styles.cellBorderBottom]}>
            <View style={styles.cellIconContainer}>
              <Feather name="calendar" size={18} color="#00897B" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>{t.registerBefore}</Text>
              <Text style={styles.cellDate}>{regEnd.dateStr}</Text>
              <Text style={styles.cellTime}>{regEnd.timeStr}</Text>
            </View>
          </View>

          {/* Item 2: Submission Starts */}
          <View style={[styles.gridCell, styles.cellBorderBottom]}>
            <View style={styles.cellIconContainer}>
              <Feather name="send" size={18} color="#00897B" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>{t.submissionStarts}</Text>
              <Text style={styles.cellDate}>{subStart.dateStr}</Text>
              <Text style={styles.cellTime}>{subStart.timeStr}</Text>
            </View>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.gridRow}>
          {/* Item 3: Submission Ends */}
          <View style={[styles.gridCell, styles.cellBorderRight]}>
            <View style={styles.cellIconContainer}>
              <Feather name="upload" size={18} color="#00897B" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>{t.submissionEnds}</Text>
              <Text style={styles.cellDate}>{subEnd.dateStr}</Text>
              <Text style={styles.cellTime}>{subEnd.timeStr}</Text>
            </View>
          </View>

          {/* Item 4: Result Date */}
          <View style={styles.gridCell}>
            <View style={styles.cellIconContainer}>
              <Ionicons name="trophy-outline" size={18} color="#00897B" />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>{t.resultDate}</Text>
              <Text style={styles.cellDate}>{resultDate.dateStr}</Text>
              <Text style={styles.cellTime}>{resultDate.timeStr}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    gap: 10,
  },
  cellBorderRight: {
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  cellBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  cellIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellContent: {
    flex: 1,
  },
  cellLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2,
  },
  cellDate: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 1,
  },
  cellTime: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});
