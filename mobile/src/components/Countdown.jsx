import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { calculateCountdown } from '../utils/date';
import { colors } from '../theme/colors';

export const Countdown = ({ targetDate, t, serverOffsetMs = 0 }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateCountdown(targetDate, serverOffsetMs));

  useEffect(() => {
    setTimeLeft(calculateCountdown(targetDate, serverOffsetMs));

    const intervalId = setInterval(() => {
      setTimeLeft(calculateCountdown(targetDate, serverOffsetMs));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate, serverOffsetMs]);

  if (!targetDate) {
    return null;
  }

  if (timeLeft.isExpired) {
    return (
      <View style={[styles.container, styles.expiredContainer]}>
        <Ionicons name="time-outline" size={16} color="#DC2626" />
        <Text style={styles.expiredText}>{t.registrationClosed || 'Registration Closed'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Ionicons name="hourglass-outline" size={16} color="#006D63" />
        <Text style={styles.label}>{t.registrationClosesIn}</Text>
      </View>

      <Text style={styles.timerText}>
        {`${timeLeft.days}d : ${timeLeft.hours}h : ${timeLeft.minutes}m : ${timeLeft.seconds}s`}
      </Text>

      <View style={styles.right}>
        <Ionicons name="stopwatch-outline" size={16} color="#006D63" />
        <Text style={styles.hurryText}>{t.hurryUp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6F5F3',
    marginHorizontal: 16,
    marginVertical: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  expiredContainer: {
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    gap: 6,
  },
  expiredText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006D63',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#006D63',
    letterSpacing: 0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hurryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006D63',
  },
});
