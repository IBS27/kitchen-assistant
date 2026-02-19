import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import { useAuth } from '@/contexts/auth-context';

type ActiveAction = 'retry' | 'signOut' | null;

export function ProfileLoadError() {
  const { refreshProfile, signOut } = useAuth();
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);
  const isBusy = activeAction !== null;

  const handleRetry = async () => {
    if (isBusy) return;

    setActiveAction('retry');
    try {
      const refreshed = await refreshProfile();
      if (!refreshed) {
        Alert.alert(
          'Could not load profile',
          'Please check your connection and try again.',
        );
      }
    } catch {
      Alert.alert(
        'Could not load profile',
        'Please check your connection and try again.',
      );
    } finally {
      setActiveAction(null);
    }
  };

  const handleSignOut = async () => {
    if (isBusy) return;

    setActiveAction('signOut');
    try {
      await signOut();
    } catch {
      Alert.alert('Sign out failed', 'Please try signing out again.');
      setActiveAction(null);
    }
  };

  return (
    <View className="flex-1 bg-kitchen-cream px-6 items-center justify-center">
      <View className="w-full max-w-md bg-white rounded-2xl p-6 border border-kitchen-brown/10">
        <Text className="text-2xl font-bold text-kitchen-brown mb-2">
          We&apos;re having trouble loading your profile
        </Text>
        <Text className="text-base text-kitchen-brown/70 mb-6">
          This is usually temporary. Try again, or sign out and sign back in.
        </Text>

        <Pressable
          onPress={handleRetry}
          disabled={isBusy}
          className="w-full bg-primary-600 rounded-2xl py-4 items-center mb-3 active:bg-primary-700">
          {activeAction === 'retry' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold">Retry</Text>
          )}
        </Pressable>

        <Pressable
          onPress={handleSignOut}
          disabled={isBusy}
          className="w-full bg-white border border-kitchen-brown/20 rounded-2xl py-4 items-center active:bg-gray-50">
          {activeAction === 'signOut' ? (
            <ActivityIndicator color="#6B4226" />
          ) : (
            <Text className="text-kitchen-brown text-base font-semibold">
              Sign Out
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
