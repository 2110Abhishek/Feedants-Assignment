import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const JudgeCard = ({ judge, t, onPlayVideo }) => {
  if (!judge) return null;

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <Image
          source={{ uri: judge.profileImageUrl || 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=200' }}
          style={styles.avatar}
          defaultSource={{ uri: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=200' }}
        />
        <View style={styles.details}>
          <Text style={styles.judgeLabel}>{t.judge}</Text>
          <Text style={styles.judgeName}>{judge.name}</Text>
          <Text style={styles.designation}>{judge.designation}</Text>
          <Text style={styles.experience}>
            {t.yearsExp ? t.yearsExp.replace('{years}', judge.experienceYears) : `${judge.experienceYears}+ Years of Experience`}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.videoButton} onPress={onPlayVideo} activeOpacity={0.8}>
        <View style={styles.playCircle}>
          <Ionicons name="play" size={16} color="#006D63" style={{ marginLeft: 2 }} />
        </View>
        <Text style={styles.videoText}>{t.introVideo}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  details: {
    flex: 1,
  },
  judgeLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 2,
  },
  judgeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  designation: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  experience: {
    fontSize: 11,
    color: '#94A3B8',
  },
  videoButton: {
    alignItems: 'center',
    paddingLeft: 8,
  },
  playCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  videoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
});
