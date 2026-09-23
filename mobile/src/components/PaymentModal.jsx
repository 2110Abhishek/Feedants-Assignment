import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { formatCurrency } from '../utils/currency';
import { colors } from '../theme/colors';

export const PaymentModal = ({
  visible,
  onClose,
  onConfirmPayment,
  competitionTitle,
  entryFee,
  currency = 'INR',
  t,
}) => {
  const [step, setStep] = useState('review'); // 'review' | 'processing' | 'success'

  const handlePay = async () => {
    setStep('processing');
    try {
      await onConfirmPayment();
      setStep('success');
      setTimeout(() => {
        setStep('review');
        onClose();
      }, 1500);
    } catch {
      setStep('review');
    }
  };

  const handleClose = () => {
    if (step !== 'processing') {
      setStep('review');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {step === 'processing' ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#00897B" />
              <Text style={styles.processingText}>Processing Mock Payment...</Text>
              <Text style={styles.subProcessing}>Connecting to simulated Razorpay gateway</Text>
            </View>
          ) : step === 'success' ? (
            <View style={styles.centerBox}>
              <Ionicons name="checkmark-circle" size={54} color="#10B981" />
              <Text style={styles.successText}>Registration Confirmed!</Text>
              <Text style={styles.subProcessing}>Payment of {formatCurrency(entryFee, currency)} received.</Text>
            </View>
          ) : (
            <View>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Mock Checkout</Text>
                  <Text style={styles.poweredBy}>Simulated Razorpay Gateway</Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Order Details */}
              <View style={styles.orderBox}>
                <Text style={styles.orderTitle}>{competitionTitle}</Text>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Entry Fee</Text>
                  <Text style={styles.feeValue}>{formatCurrency(entryFee, currency)}</Text>
                </View>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Convenience Fee</Text>
                  <Text style={styles.freeFee}>FREE</Text>
                </View>
                <View style={[styles.feeRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Payable</Text>
                  <Text style={styles.totalValue}>{formatCurrency(entryFee, currency)}</Text>
                </View>
              </View>

              {/* Payment Methods info */}
              <View style={styles.methodInfo}>
                <Feather name="shield" size={16} color="#00897B" />
                <Text style={styles.methodText}>
                  Test Mode: Clicking below simulates an instant successful payment transaction.
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleClose} activeOpacity={0.7}>
                  <Text style={styles.cancelText}>{t.cancel}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.confirmBtn} onPress={handlePay} activeOpacity={0.85}>
                  <Text style={styles.confirmText}>
                    {t.pay} {formatCurrency(entryFee, currency)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  poweredBy: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  orderBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  feeLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  feeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  freeFee: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#007A6E',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E6F5F3',
    padding: 10,
    borderRadius: 8,
    marginBottom: 18,
  },
  methodText: {
    fontSize: 11,
    color: '#006D63',
    flex: 1,
    lineHeight: 16,
  },
  actionRow: {
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
  confirmBtn: {
    flex: 2,
    backgroundColor: '#005C53',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    gap: 10,
  },
  processingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  successText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
  },
  subProcessing: {
    fontSize: 12,
    color: '#64748B',
  },
});
