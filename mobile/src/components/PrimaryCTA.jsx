import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/currency';

export const PrimaryCTA = ({
  ctaState,
  entryFee,
  currency = 'INR',
  isLoading = false,
  onPress,
  t,
}) => {
  const { action, label, subLabel, enabled } = ctaState || {
    action: 'REGISTER',
    label: 'Register Now',
    subLabel: null,
    enabled: true,
  };

  const getButtonText = () => {
    switch (action) {
      case 'REGISTER':
        return `${t.registerNow} • ${formatCurrency(entryFee, currency)}`;
      case 'SUBMIT':
        return t.uploadSubmission;
      case 'REGISTERED':
        return t.registered;
      case 'FULL':
        return t.competitionFull;
      case 'REGISTRATION_CLOSED':
        return t.registrationClosed;
      case 'SUBMISSION_CLOSED':
        return t.submissionClosed;
      case 'JUDGING':
        return t.judgingInProgress;
      case 'RESULTS':
        return t.viewResults;
      case 'UPCOMING':
        return t.registrationStartsSoon;
      default:
        return label || t.registerNow;
    }
  };

  const getSubText = () => {
    if (subLabel) return subLabel;
    if (action === 'SUBMIT') return t.registered;
    if (action === 'REGISTER') return 'Tap to proceed with mock checkout';
    return null;
  };

  const isClickable = enabled && !isLoading;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          !isClickable && styles.buttonDisabled,
        ]}
        onPress={isClickable ? onPress : undefined}
        activeOpacity={0.85}
        disabled={!isClickable}
        accessible
        accessibilityRole="button"
        accessibilityLabel={getButtonText()}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <View style={styles.textWrapper}>
            <Text style={[styles.mainText, !isClickable && styles.mainTextDisabled]}>
              {getButtonText()}
            </Text>
            {getSubText() && (
              <Text style={styles.subText}>{getSubText()}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  button: {
    backgroundColor: '#005C53', // Feedants dark teal
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#005C53', // In screenshot, registered button stays dark teal with subtext
    opacity: 0.9,
  },
  textWrapper: {
    alignItems: 'center',
  },
  mainText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  mainTextDisabled: {
    color: '#FFFFFF',
  },
  subText: {
    fontSize: 11,
    color: '#A7F3D0',
    marginTop: 2,
    fontWeight: '600',
  },
});
