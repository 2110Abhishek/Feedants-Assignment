import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const PreviousWinners = ({ winners = [], t, onSelectWinner }) => {
  if (!winners || winners.length === 0) return null;

  const getPositionText = (pos) => {
    if (pos === 1) return t.firstWinner || '1st Winner';
    if (pos === 2) return t.secondWinner || '2nd Winner';
    if (pos === 3) return t.thirdWinner || '3rd Winner';
    return `${pos}th Winner`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t.previousWinners}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {winners.map((winner, index) => (
          <TouchableOpacity
            key={index}
            style={styles.winnerCard}
            onPress={() => onSelectWinner && onSelectWinner(winner)}
            activeOpacity={0.8}
          >
            <View style={styles.imageWrapper}>
              <Image source={{ uri: winner.imageUrl }} style={styles.thumbnail} />
              <View style={styles.playBadge}>
                <Ionicons name="play" size={10} color="#00897B" style={{ marginLeft: 1 }} />
              </View>
            </View>

            <View style={styles.infoWrapper}>
              <Text style={styles.name} numberOfLines={1}>
                {winner.name}
              </Text>
              <Text style={[styles.position, winner.position === 1 ? styles.firstPos : styles.otherPos]}>
                {getPositionText(winner.position)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 6,
    paddingRight: 12,
    gap: 8,
    minWidth: 140,
  },
  imageWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  playBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00897B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoWrapper: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  position: {
    fontSize: 10,
    fontWeight: '600',
  },
  firstPos: {
    color: '#00897B',
  },
  otherPos: {
    color: '#0284C7',
  },
});
