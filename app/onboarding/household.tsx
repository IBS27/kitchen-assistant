import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingProgress } from '@/components/onboarding-progress';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

export default function HouseholdScreen() {
  const router = useRouter();
  const { session, refreshProfile } = useAuth();
  const [size, setSize] = useState(2);
  const [saving, setSaving] = useState(false);

  const handleDone = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          household_size: size,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);
      if (error) {
        Alert.alert('Error', 'Could not save. Please try again.');
        return;
      }
      await refreshProfile();
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-kitchen-cream" edges={['bottom']}>
      <Stack.Screen options={{ title: 'Household Size' }} />
      <OnboardingProgress currentStep={4} totalSteps={4} />
      <ScrollView className="flex-1 px-6" contentContainerClassName="pb-8">
        <Text className="text-2xl font-bold text-kitchen-brown mb-2">
          How many people in your household?
        </Text>
        <Text className="text-base text-kitchen-brown/60 mb-10">
          We'll adjust portion sizes and shopping amounts.
        </Text>

        <View className="items-center gap-6">
          <View className="flex-row items-center gap-8">
            <Pressable
              onPress={() => setSize((s) => Math.max(1, s - 1))}
              className="w-14 h-14 rounded-full bg-white border border-kitchen-brown/20 items-center justify-center active:bg-gray-50">
              <Text className="text-2xl text-kitchen-brown">-</Text>
            </Pressable>

            <Text className="text-5xl font-bold text-primary-600 w-16 text-center">
              {size}
            </Text>

            <Pressable
              onPress={() => setSize((s) => Math.min(8, s + 1))}
              className="w-14 h-14 rounded-full bg-white border border-kitchen-brown/20 items-center justify-center active:bg-gray-50">
              <Text className="text-2xl text-kitchen-brown">+</Text>
            </Pressable>
          </View>

          <Text className="text-base text-kitchen-brown/50">
            {size === 1 ? '1 person' : `${size} people`}
          </Text>
        </View>
      </ScrollView>

      <View className="px-6 pb-4">
        <Pressable
          onPress={handleDone}
          disabled={saving}
          className="w-full bg-primary-600 rounded-2xl py-4 items-center active:bg-primary-700">
          <Text className="text-white text-lg font-semibold">
            {saving ? 'Saving...' : 'Done'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
