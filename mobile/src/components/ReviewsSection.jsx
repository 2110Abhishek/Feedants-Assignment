import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export const ReviewsSection = ({ t, onOpenReviews }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onOpenReviews} activeOpacity={0.7}>
      <View style={styles.left}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#0F172A" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{t.hearFromUsers || 'Hear From Our Users'}</Text>
          <Text style={styles.subtitle}>{t.hearFromUsersSub || 'See what participants say about Feedants'}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color="#0F172A" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
});
