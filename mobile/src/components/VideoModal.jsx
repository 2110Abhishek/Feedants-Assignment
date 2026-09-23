import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const VideoModal = ({ visible, onClose, videoTitle, videoUrl }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {videoTitle || 'Video Player'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.playerContainer}>
            <Ionicons name="play-circle" size={64} color="#00897B" />
            <Text style={styles.videoPlayingText}>Playing Media Stream</Text>
            <Text style={styles.urlText} numberOfLines={1}>
              {videoUrl || 'https://feedants.com/stream/sample.mp4'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    width: '100%',
    maxWidth: 480,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  playerContainer: {
    height: 240,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  videoPlayingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  urlText: {
    fontSize: 11,
    color: '#64748B',
    maxWidth: '90%',
  },
});
