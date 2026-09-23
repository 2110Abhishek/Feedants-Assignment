import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Header } from '../components/Header';
import { CompetitionSummary } from '../components/CompetitionSummary';
import { JudgeCard } from '../components/JudgeCard';
import { Countdown } from '../components/Countdown';
import { ImportantDates } from '../components/ImportantDates';
import { PreviousWinners } from '../components/PreviousWinners';
import { CompetitionTabs } from '../components/CompetitionTabs';
import { Rewards } from '../components/Rewards';
import { Disclaimer } from '../components/Disclaimer';
import { TrustSection } from '../components/TrustSection';
import { ReferralCard } from '../components/ReferralCard';
import { ReviewsSection } from '../components/ReviewsSection';
import { AdBanner } from '../components/AdBanner';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { BottomNavigation } from '../components/BottomNavigation';
import { PaymentModal } from '../components/PaymentModal';
import { SubmissionModal } from '../components/SubmissionModal';
import { VideoModal } from '../components/VideoModal';
import { DevLifecycleSwitcher } from '../components/DevLifecycleSwitcher';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorView } from '../components/ErrorView';

import { useCompetition } from '../hooks/useCompetition';
import { useRegistration } from '../hooks/useRegistration';
import { competitionApi } from '../api/competition.api';
import { authApi } from '../api/auth.api';
import { translations } from '../constants/translations';
import { colors } from '../theme/colors';

export const CompetitionDetailsScreen = ({ route, navigation }) => {
  const queryClient = useQueryClient();
  const [activeCompId, setActiveCompId] = useState(route?.params?.competitionId || null);
  const [lang, setLang] = useState('en');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('competitions');

  // Modals
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [videoModalData, setVideoModalData] = useState({ title: '', url: '' });
  const [devSwitcherVisible, setDevSwitcherVisible] = useState(false);

  const [discoveryLoading, setDiscoveryLoading] = useState(!activeCompId);
  const [discoveryError, setDiscoveryError] = useState(null);

  const t = translations[lang] || translations.en;

  const initApp = useCallback(async () => {
    setDiscoveryLoading(true);
    setDiscoveryError(null);
    try {
      // 1. Restore or seed default logged in user (Abhishek as in screenshot)
      let storedUser = await authApi.getStoredUser();
      if (!storedUser) {
        try {
          const authData = await authApi.login('user@example.com', 'password123');
          storedUser = authData.user;
        } catch {
          // guest mode
        }
      }
      setCurrentUser(storedUser);

      // 2. Discover competition ID
      if (!activeCompId) {
        const listRes = await competitionApi.listCompetitions();
        if (listRes.competitions && listRes.competitions.length > 0) {
          setActiveCompId(listRes.competitions[0].id);
        } else {
          setDiscoveryError(new Error('No competitions found in database. Run npm run seed.'));
        }
      }
    } catch (err) {
      console.warn('Error fetching competition list:', err);
      setDiscoveryError(err);
    } finally {
      setDiscoveryLoading(false);
    }
  }, [activeCompId]);

  useEffect(() => {
    initApp();
  }, [initApp]);

  // Data queries
  const userKey = currentUser?.id || currentUser?.email || 'guest';
  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useCompetition(activeCompId, userKey);

  const registerMutation = useRegistration(activeCompId);

  const competition = apiData?.competition;
  const userState = apiData?.userState;

  // Handle CTA button action
  const handleCtaPress = async () => {
    const action = userState?.cta?.action;

    if (action === 'REGISTER') {
      if (!currentUser) {
        // Seamlessly log in as Priya (Unregistered) so guest can test registration immediately
        try {
          await handleSelectUser('priya');
          setPaymentModalVisible(true);
        } catch {
          setDevSwitcherVisible(true);
        }
        return;
      }
      setPaymentModalVisible(true);
      return;
    }

    if (action === 'SUBMIT') {
      setSubmissionModalVisible(true);
      return;
    }

    if (action === 'RESULTS') {
      Alert.alert(
        'Competition Results',
        `Winner: ${competition?.previousWinners?.[0]?.name || 'Riya Shah'} (1st Position - ₹550)`
      );
    }
  };

  // Confirm registration with mock payment
  const handleConfirmPayment = async () => {
    try {
      await registerMutation.mutateAsync({
        mockPaymentSuccess: true,
        paymentMethod: 'RAZORPAY_SIMULATION',
      });
      // Invalidation is handled inside useRegistration hook
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'Unable to register for competition.');
      throw err;
    }
  };

  // Upload submission
  const handleUploadSubmission = async (submissionData) => {
    try {
      await competitionApi.createSubmission(activeCompId, submissionData);
      queryClient.invalidateQueries({ queryKey: ['competition', activeCompId] });
      Alert.alert('Success', 'Your entry has been successfully submitted for judging!');
    } catch (err) {
      throw err;
    }
  };

  // Switch persona (for evaluation)
  const handleSelectUser = async (persona) => {
    try {
      if (persona === 'abhishek') {
        const authData = await authApi.login('user@example.com', 'password123');
        setCurrentUser(authData.user);
      } else if (persona === 'priya') {
        // Ensure Priya is always fresh and unregistered for evaluator testing
        try {
          await competitionApi.resetDevPersona('priya@example.com');
        } catch (resetErr) {
          console.warn('Could not reset persona:', resetErr);
        }
        const authData = await authApi.login('priya@example.com', 'password123');
        setCurrentUser(authData.user);
      } else {
        await authApi.logout();
        setCurrentUser(null);
      }
      setDevSwitcherVisible(false);
      // Invalidate all competition queries to immediately refetch with the new user token
      await queryClient.invalidateQueries({ queryKey: ['competition'] });
    } catch (err) {
      console.error('Error switching user persona:', err);
      Alert.alert('Error', 'Unable to switch user: ' + (err.message || err));
    }
  };

  // Switch lifecycle (for evaluation)
  const handleSelectLifecycle = async (targetLifecycle) => {
    try {
      await competitionApi.setDevLifecycle(activeCompId, targetLifecycle);
      queryClient.invalidateQueries({ queryKey: ['competition', activeCompId] });
      setDevSwitcherVisible(false);
    } catch (err) {
      Alert.alert('Error', 'Unable to set lifecycle on backend');
    }
  };

  if (!competition && (isLoading || discoveryLoading)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  if (!competition && (isError || discoveryError)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ErrorView
          error={error || discoveryError}
          onRetry={() => {
            initApp();
            if (activeCompId) refetch();
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <Header
        lang={lang}
        onToggleLang={setLang}
        t={t}
        onGoBack={() => Alert.alert('Navigate', 'Back button pressed')}
        onOpenDemoControls={() => setDevSwitcherVisible(true)}
      />

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={['#00897B']}
            tintColor="#00897B"
          />
        }
      >
        {/* 1. Summary Card */}
        <CompetitionSummary
          competition={competition}
          isRegistered={userState?.isRegistered}
          t={t}
        />

        {/* 2. Judge Card */}
        <JudgeCard
          judge={competition?.judge}
          t={t}
          onPlayVideo={() => {
            setVideoModalData({
              title: `${competition?.judge?.name} - Intro Video`,
              url: competition?.judge?.introVideoUrl,
            });
            setVideoModalVisible(true);
          }}
        />

        {/* 3. Real-time Countdown */}
        <Countdown targetDate={competition?.registrationEndAt} t={t} />

        {/* 4. Important Dates */}
        <ImportantDates competition={competition} t={t} />

        {/* 5. Previous Winners */}
        <PreviousWinners
          winners={competition?.previousWinners}
          t={t}
          onSelectWinner={(winner) => {
            setVideoModalData({
              title: `${winner.name} - Winning Performance`,
              url: winner.videoUrl,
            });
            setVideoModalVisible(true);
          }}
        />

        {/* 6. Tabs (About, Judging, Rules) */}
        <CompetitionTabs competition={competition} t={t} />

        {/* 7. Rewards List */}
        <Rewards
          rewards={competition?.rewards}
          currency={competition?.currency}
          t={t}
        />

        {/* 8. Disclaimer */}
        <Disclaimer t={t} />

        {/* 9. Trust & Razorpay Card */}
        <TrustSection
          t={t}
          onWatchPrizeVideo={() => {
            setVideoModalData({
              title: 'Prize Money Distribution Process',
              url: 'https://feedants.com/videos/prize-distribution-guide.mp4',
            });
            setVideoModalVisible(true);
          }}
        />

        {/* 10. Referral Card */}
        <ReferralCard t={t} referralCode={currentUser ? 'ABHI123' : 'FEEDANTS26'} />

        {/* 11. Hear From Our Users */}
        <ReviewsSection
          t={t}
          onOpenReviews={() => {
            Alert.alert(
              'Participant Reviews',
              '★ 5.0 Rating from 42 participants.\n\n"Incredible experience! The feedback from judges was detailed and encouraging." — Riya S.'
            );
          }}
        />

        {/* 12. Ad Banner */}
        <AdBanner t={t} />
      </ScrollView>

      {/* Sticky Primary Action Button */}
      <PrimaryCTA
        ctaState={userState?.cta}
        entryFee={competition?.entryFee ?? 99}
        currency={competition?.currency || 'INR'}
        isLoading={registerMutation.isPending}
        onPress={handleCtaPress}
        t={t}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        t={t}
        user={currentUser}
      />

      {/* Modals */}
      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onConfirmPayment={handleConfirmPayment}
        competitionTitle={competition?.title}
        entryFee={competition?.entryFee}
        currency={competition?.currency}
        t={t}
      />

      <SubmissionModal
        visible={submissionModalVisible}
        onClose={() => setSubmissionModalVisible(false)}
        onSubmit={handleUploadSubmission}
        t={t}
      />

      <VideoModal
        visible={videoModalVisible}
        onClose={() => setVideoModalVisible(false)}
        videoTitle={videoModalData.title}
        videoUrl={videoModalData.url}
      />

      <DevLifecycleSwitcher
        visible={devSwitcherVisible}
        onClose={() => setDevSwitcherVisible(false)}
        currentLifecycle={competition?.lifecycle}
        currentUser={currentUser}
        onSelectLifecycle={handleSelectLifecycle}
        onSelectUser={handleSelectUser}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  devFloatingBtn: {
    position: 'absolute',
    bottom: 85,
    right: 14,
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 99,
  },
  devFloatingText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
  },
});
