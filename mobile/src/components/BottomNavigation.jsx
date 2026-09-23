import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const BottomNavigation = ({ activeTab = 'competitions', onSelectTab, t, user }) => {
  return (
    <View style={styles.bottomBar}>
      {/* 1. Home */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab && onSelectTab('home')}
        activeOpacity={0.7}
      >
        <Feather
          name="home"
          size={20}
          color={activeTab === 'home' ? '#00897B' : '#94A3B8'}
        />
        <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
          {t.home}
        </Text>
      </TouchableOpacity>

      {/* 2. Explore */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab && onSelectTab('explore')}
        activeOpacity={0.7}
      >
        <Feather
          name="search"
          size={20}
          color={activeTab === 'explore' ? '#00897B' : '#94A3B8'}
        />
        <Text style={[styles.tabLabel, activeTab === 'explore' && styles.tabLabelActive]}>
          {t.explore}
        </Text>
      </TouchableOpacity>

      {/* 3. Create (+) Button */}
      <TouchableOpacity
        style={styles.createTabItem}
        onPress={() => onSelectTab && onSelectTab('create')}
        activeOpacity={0.85}
      >
        <View style={styles.createBadge}>
          <Feather name="plus" size={22} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* 4. Competitions (Active) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab && onSelectTab('competitions')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="trophy-outline"
          size={20}
          color={activeTab === 'competitions' ? '#00897B' : '#94A3B8'}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'competitions' && styles.tabLabelActive,
          ]}
        >
          {t.competitions}
        </Text>
      </TouchableOpacity>

      {/* 5. Profile */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab && onSelectTab('profile')}
        activeOpacity={0.7}
      >
        {user?.profileImageUrl ? (
          <Image source={{ uri: user.profileImageUrl }} style={styles.userAvatar} />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={22}
            color={activeTab === 'profile' ? '#00897B' : '#94A3B8'}
          />
        )}
        <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
          {t.profile}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 6,
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#00897B',
    fontWeight: '700',
  },
  createTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  createBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007A6E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007A6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
