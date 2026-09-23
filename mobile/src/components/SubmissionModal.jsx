import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const SubmissionModal = ({
  visible,
  onClose,
  onSubmit,
  existingSubmission,
  t,
}) => {
  const [title, setTitle] = useState(existingSubmission?.title || '');
  const [mediaUrl, setMediaUrl] = useState(
    existingSubmission?.mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  );
  const [description, setDescription] = useState(existingSubmission?.description || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a submission title.');
      return;
    }
    if (!mediaUrl.trim() || !mediaUrl.startsWith('http')) {
      setErrorMsg('Please enter a valid video URL.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);
    try {
      await onSubmit({ title, mediaUrl, description });
      setSubmitting(false);
      onClose();
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.message || 'Failed to submit entry.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t.submitEntryTitle}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll}>
            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>{t.titleLabel} *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Kathak Classical Nritya Performance"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>{t.mediaUrlLabel} *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="https://..."
              value={mediaUrl}
              onChangeText={setMediaUrl}
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>{t.descLabel}</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Tell the judges about your routine, raag, taal..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={submitting}>
              <Text style={styles.cancelText}>{t.cancel}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>{t.submitButton}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 440,
    maxHeight: '85%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    marginBottom: 16,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  submitBtn: {
    flex: 2,
    backgroundColor: '#005C53',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
