import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CompetitionDetailsScreen } from './src/screens/CompetitionDetailsScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 20,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <View style={styles.outerContainer}>
          <View style={styles.phoneContainer}>
            <CompetitionDetailsScreen />
          </View>
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0F172A', // Sleek dark slate backdrop for web
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : '100%',
    maxHeight: Platform.OS === 'web' ? 920 : '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          borderRadius: 24,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
          borderWidth: 8,
          borderColor: '#1E293B',
          marginVertical: 20,
        }
      : {}),
  },
});
