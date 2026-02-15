import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingProgress } from '@/components/onboarding-progress';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

export default function DislikesScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [foods, setFoods] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);

  const addFood = () => {
    const trimmed = input.trim();
    if (trimmed && !foods.includes(trimmed)) {
      setFoods((prev) => [...prev, trimmed]);
      setInput('');
    }
  };

  const removeFood = (food: string) => {
    setFoods((prev) => prev.filter((f) => f !== food));
  };

  const handleNext = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ disliked_foods: foods })
        .eq('id', session.user.id);
      if (error) {
        Alert.alert('Error', 'Could not save. Please try again.');
        return;
      }
      router.push('/onboarding/frequency');
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-kitchen-cream" edges={['bottom']}>
      <Stack.Screen options={{ title: 'Disliked Foods' }} />
      <OnboardingProgress currentStep={2} totalSteps={4} />
      <ScrollView className="flex-1 px-6" contentContainerClassName="pb-8">
        <Text className="text-2xl font-bold text-kitchen-brown mb-2">
          Any foods you dislike?
        </Text>
        <Text className="text-base text-kitchen-brown/60 mb-6">
          We'll avoid suggesting these in your meals.
        </Text>

        <View className="flex-row gap-2 mb-4">
          <TextInput
            className="flex-1 bg-white border border-kitchen-brown/20 rounded-2xl px-4 py-3 text-base text-kitchen-brown"
            placeholder="e.g. cilantro, olives..."
            placeholderTextColor="#A89880"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={addFood}
            returnKeyType="done"
          />
          <Pressable
            onPress={addFood}
            className="bg-primary-500 rounded-2xl px-5 justify-center active:bg-primary-600">
            <Text className="text-white text-lg font-bold">+</Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {foods.map((food) => (
            <Pressable
              key={food}
              onPress={() => removeFood(food)}
              className="flex-row items-center gap-2 bg-secondary-100 border border-secondary-300 rounded-2xl px-4 py-2">
              <Text className="text-base text-kitchen-brown">{food}</Text>
              <Text className="text-kitchen-brown/50 text-lg">x</Text>
            </Pressable>
          ))}
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
