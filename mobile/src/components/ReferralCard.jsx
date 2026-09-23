import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const ReferralCard = ({ t, referralCode = 'referral123' }) => {
  const [copied, setCopied] = useState(false);
  const referralUrl = `https://feedants.com/r/referral123`;

  const handleCopy = () => {
    setCopied(true);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(referralUrl).catch(() => {});
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'Feedants Classical Dance',
          text: `Join Feedants Dance Competitions with my referral link: ${referralUrl}`,
          url: referralUrl,
        });
      } else {
        await Share.share({
          message: `Join Feedants Dance Competitions with my referral link: ${referralUrl}`,
          url: referralUrl,
        });
      }
    } catch {
      handleCopy();
    }
  };

  return (
    <View style={styles.card}>
      {/* Green line art Megaphone icon */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="bullhorn-outline" size={28} color="#00897B" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t.referEarnTitle || 'Refer & Earn more discount'}</Text>

        <View style={styles.actionsRow}>
          {/* Left section: Input URL + Copy Link button */}
          <View style={styles.linkGroup}>
            <View style={styles.urlBox}>
              <Text style={styles.urlText} numberOfLines={1}>
                {referralUrl}
              </Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.7}>
              <Text style={styles.copyBtnText}>
                {copied ? (t.copied || 'Copied') : (t.copyLink || 'Copy Link')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Right section: Refer Now button + subtext */}
          <View style={styles.referGroup}>
            <TouchableOpacity style={styles.referNowBtn} onPress={handleShare} activeOpacity={0.8}>
              <Text style={styles.referNowText}>{t.referNow || 'Refer Now'}</Text>
            </TouchableOpacity>
            <Text style={styles.earnText}>
              {t.referSub || 'You earn ₹10 for every signup'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F6F3', // Soft mint matching Image 1
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#C8EAE2',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  iconContainer: {
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  linkGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  urlBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  urlText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '400',
  },
  copyBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyBtnText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  referGroup: {
    alignItems: 'center',
  },
  referNowBtn: {
    backgroundColor: '#006D63', // Dark teal as in Image 1
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  referNowText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  earnText: {
    fontSize: 8.5,
    fontWeight: '500',
    color: '#006D63',
    marginTop: 3,
    textAlign: 'center',
  },
});
