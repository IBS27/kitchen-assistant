import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingProgress } from '@/components/onboarding-progress';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

const FREQUENCY_OPTIONS = [
  { label: 'Daily', days: 1 },
  { label: 'Every 3 days', days: 3 },
  { label: 'Weekly', days: 7 },
  { label: 'Every 2 weeks', days: 14 },
  { label: 'Monthly', days: 30 },
];

export default function FrequencyScreen() {
  const router = useRouter();
  const { session, profile } = useAuth();
  const [selectedDays, setSelectedDays] = useState(7);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile?.shopping_frequency_days) return;
    setSelectedDays(profile.shopping_frequency_days);
  }, [profile]);

  const handleNext = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ shopping_frequency_days: selectedDays })
        .eq('id', session.user.id);
      if (error) {
        Alert.alert('Error', 'Could not save. Please try again.');
        return;
      }
      router.push('/onboarding/household');
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-kitchen-cream" edges={['bottom']}>
      <Stack.Screen options={{ title: 'Shopping Frequency' }} />
      <OnboardingProgress currentStep={3} totalSteps={4} />
      <ScrollView className="flex-1 px-6" contentContainerClassName="pb-8">
        <Text className="text-2xl font-bold text-kitchen-brown mb-2">
          How often do you shop?
        </Text>
        <Text className="text-base text-kitchen-brown/60 mb-6">
          This helps us plan your meals and shopping lists.
        </Text>

        <View className="gap-3">
          {FREQUENCY_OPTIONS.map((option) => {
            const isSelected = selectedDays === option.days;
            return (
              <Pressable
                key={option.days}
                onPress={() => setSelectedDays(option.days)}
                className={`py-4 px-5 rounded-2xl border ${
                  isSelected
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-white border-kitchen-brown/20'
                }`}>
                <Text
                  className={`text-base font-medium ${
                    isSelected ? 'text-white' : 'text-kitchen-brown'
                  }`}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className="px-6 pb-4">
        <Pressable
          onPress={handleNext}
          disabled={saving}
          className="w-full bg-primary-600 rounded-2xl py-4 items-center active:bg-primary-700">
          <Text className="text-white text-lg font-semibold">
            {saving ? 'Saving...' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
