import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const LIFECYCLES = [
  { id: 'REGISTRATION_OPEN', label: 'Registration Open (Default - In Screenshot)' },
  { id: 'UPCOMING', label: 'Upcoming (Starts in Future)' },
  { id: 'REGISTRATION_CLOSED', label: 'Registration Closed' },
  { id: 'SUBMISSION_OPEN', label: 'Submission Open' },
  { id: 'SUBMISSION_CLOSED', label: 'Submission Closed' },
  { id: 'JUDGING', label: 'Judging In Progress' },
  { id: 'RESULTS_PUBLISHED', label: 'Results Published' },
];

export const DevLifecycleSwitcher = ({
  visible,
  onClose,
  currentLifecycle,
  currentUser,
  onSelectLifecycle,
  onSelectUser,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Evaluator Demo Controls</Text>
              <Text style={styles.subTitle}>Simulate lifecycles & users instantly</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            {/* User Personas */}
            <Text style={styles.sectionHeader}>1. Active User Persona</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.chip, currentUser?.email === 'user@example.com' && styles.chipActive]}
                onPress={() => onSelectUser('abhishek')}
              >
                <Text style={[styles.chipText, currentUser?.email === 'user@example.com' && styles.chipTextActive]}>
                  Abhishek (Registered)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chip, currentUser?.email === 'priya@example.com' && styles.chipActive]}
                onPress={() => onSelectUser('priya')}
              >
                <Text style={[styles.chipText, currentUser?.email === 'priya@example.com' && styles.chipTextActive]}>
                  Priya (Unregistered)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chip, !currentUser && styles.chipActive]}
                onPress={() => onSelectUser('guest')}
              >
                <Text style={[styles.chipText, !currentUser && styles.chipTextActive]}>
                  Guest (Logged Out)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Lifecycle Stages */}
            <Text style={[styles.sectionHeader, { marginTop: 16 }]}>2. Competition Lifecycle Stage</Text>
            <View style={styles.list}>
              {LIFECYCLES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.lifecycleItem, currentLifecycle === item.id && styles.lifecycleItemActive]}
                  onPress={() => onSelectLifecycle(item.id)}
                >
                  <Text style={[styles.lifecycleText, currentLifecycle === item.id && styles.lifecycleTextActive]}>
                    {item.label}
                  </Text>
                  {currentLifecycle === item.id && (
                    <Ionicons name="checkmark-circle" size={18} color="#00897B" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subTitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chipActive: {
    backgroundColor: '#E0F2F1',
    borderColor: '#00897B',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#00695C',
    fontWeight: '700',
  },
  list: {
    gap: 8,
  },
  lifecycleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  lifecycleItemActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#00897B',
  },
  lifecycleText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  lifecycleTextActive: {
    color: '#00695C',
    fontWeight: '700',
  },
});
