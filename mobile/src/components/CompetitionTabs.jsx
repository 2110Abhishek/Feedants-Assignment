import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const CompetitionTabs = ({ competition, t }) => {
  const [activeTab, setActiveTab] = useState(0); // 0: About, 1: Judging, 2: Rules
  const [isExpanded, setIsExpanded] = useState(false);

  if (!competition) return null;

  return (
    <View style={styles.container}>
      {/* Tabs Header */}
      <View style={styles.tabsHeader}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 0 && styles.tabButtonActive]}
          onPress={() => setActiveTab(0)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 0 && styles.tabTextActive]}>
            {t.aboutTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 1 && styles.tabButtonActive]}
          onPress={() => setActiveTab(1)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 1 && styles.tabTextActive]}>
            {t.judgingTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 2 && styles.tabButtonActive]}
          onPress={() => setActiveTab(2)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 2 && styles.tabTextActive]}>
            {t.rulesTab}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContentContainer}>
        {activeTab === 0 && (
          <View>
            <Text
              style={styles.descriptionText}
              numberOfLines={isExpanded ? undefined : 3}
            >
              {competition.description}
            </Text>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => setIsExpanded(!isExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewMoreText}>
                {isExpanded ? t.viewLess : t.viewMore}
              </Text>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color="#006D63"
              />
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 1 && (
          <View style={styles.parametersList}>
            {(competition.judgingParameters || []).map((param, index) => (
              <View key={index} style={styles.parameterRow}>
                <View style={styles.parameterLeft}>
                  <Text style={styles.parameterName}>{param.name}</Text>
                  {param.description ? (
                    <Text style={styles.parameterDesc}>{param.description}</Text>
                  ) : null}
                </View>
                <View style={styles.weightBadge}>
                  <Text style={styles.weightText}>{param.weight}%</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 2 && (
          <View style={styles.rulesList}>
            {(competition.rules || []).map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <View style={styles.ruleBullet} />
                <Text style={styles.ruleText}>{rule.description || rule}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#00897B',
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#00897B',
    fontWeight: '700',
  },
  tabContentContainer: {
    padding: 14,
  },
  descriptionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
    paddingVertical: 4,
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006D63',
  },
  parametersList: {
    gap: 8,
  },
  parameterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  parameterLeft: {
    flex: 1,
  },
  parameterName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  parameterDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  weightBadge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  weightText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00695C',
  },
  rulesList: {
    gap: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  ruleBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00897B',
    marginTop: 6,
  },
  ruleText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
});
