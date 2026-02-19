import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingProgress } from '@/components/onboarding-progress';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { normalizeDietaryPreferences } from '@/lib/profile-normalization';

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Halal',
  'Kosher',
  'None',
];

export default function DietaryScreen() {
  const router = useRouter();
  const { session, profile } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const savedPreferences = normalizeDietaryPreferences(
      profile.dietary_preferences ?? [],
    );
    setSelected(savedPreferences);
  }, [profile]);

  const toggleOption = (option: string) => {
    if (option === 'None') {
      setSelected((prev) => (prev.includes('None') ? [] : ['None']));
      return;
    }
    setSelected((prev) => {
      const without = prev.filter((s) => s !== 'None');
      return without.includes(option)
        ? without.filter((s) => s !== option)
        : [...without, option];
    });
  };

  const handleNext = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const prefs = normalizeDietaryPreferences(selected);
      const { error } = await supabase
        .from('profiles')
        .update({ dietary_preferences: prefs })
        .eq('id', session.user.id);
      if (error) {
        Alert.alert('Error', 'Could not save. Please try again.');
        return;
      }
      router.push('/onboarding/dislikes');
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-kitchen-cream" edges={['bottom']}>
      <Stack.Screen options={{ title: 'Dietary Preferences' }} />
      <OnboardingProgress currentStep={1} totalSteps={4} />
      <ScrollView className="flex-1 px-6" contentContainerClassName="pb-8">
        <Text className="text-2xl font-bold text-kitchen-brown mb-2">
          Any dietary preferences?
        </Text>
        <Text className="text-base text-kitchen-brown/60 mb-6">
          We&apos;ll tailor meal suggestions to match your diet.
        </Text>

        <View className="flex-row flex-wrap gap-3">
          {DIETARY_OPTIONS.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <Pressable
                key={option}
                onPress={() => toggleOption(option)}
                className={`px-4 py-3 rounded-2xl border ${
                  isSelected
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-white border-kitchen-brown/20'
                }`}>
                <Text
                  className={`text-base font-medium ${
                    isSelected ? 'text-white' : 'text-kitchen-brown'
                  }`}>
                  {option}
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
