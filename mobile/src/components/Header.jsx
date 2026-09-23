import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const Header = ({
  lang,
  onToggleLang,
  t,
  onGoBack,
  onOpenDemoControls,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={19} color="#0F172A" />
        <Text style={styles.backText}>{t.goBack || 'Go back'}</Text>
      </TouchableOpacity>

      {/* Right Header Section: Demo Controls + Language Switcher side by side */}
      <View style={styles.rightSection}>
        {onOpenDemoControls && (
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={onOpenDemoControls}
            activeOpacity={0.8}
          >
            <Text style={styles.demoText}>⚡ Demo Controls</Text>
          </TouchableOpacity>
        )}

        {/* Language Pill Switcher */}
        <View style={styles.langPillContainer}>
          <TouchableOpacity
            style={[styles.langPill, lang === 'en' && styles.langPillActive]}
            onPress={() => onToggleLang('en')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, lang === 'en' && styles.langTextActive]}>ENG</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langPill, lang === 'hi' && styles.langPillActive]}
            onPress={() => onToggleLang('hi')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, lang === 'hi' && styles.langTextActive]}>हिंदी</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  langPillContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 2,
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  langPillActive: {
    backgroundColor: '#005C53', // Dark teal as in Image 1
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
