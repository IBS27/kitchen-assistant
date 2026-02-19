import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';
import {
  normalizeDietaryPreferences,
  normalizeDislikedFoods,
} from '@/lib/profile-normalization';
import { supabase } from '@/lib/supabase';

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

const FREQUENCY_OPTIONS = [
  { label: 'Daily', days: 1 },
  { label: 'Every 3 days', days: 3 },
  { label: 'Weekly', days: 7 },
  { label: 'Every 2 weeks', days: 14 },
  { label: 'Monthly', days: 30 },
];

export default function ProfileScreen() {
  const { session, profile, signOut, refreshProfile } = useAuth();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Local edit state
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(
    profile?.dietary_preferences ?? [],
  );
  const [dislikedFoods, setDislikedFoods] = useState<string[]>(
    profile?.disliked_foods ?? [],
  );
  const [dislikeInput, setDislikeInput] = useState('');
  const [frequency, setFrequency] = useState(
    profile?.shopping_frequency_days ?? 7,
  );
  const [householdSize, setHouseholdSize] = useState(
    profile?.household_size ?? 2,
  );

  useEffect(() => {
    if (profile) {
      setDietaryPrefs(
        normalizeDietaryPreferences(profile.dietary_preferences ?? []),
      );
      setDislikedFoods(normalizeDislikedFoods(profile.disliked_foods ?? []));
      setFrequency(profile.shopping_frequency_days ?? 7);
      setHouseholdSize(profile.household_size ?? 2);
    }
  }, [profile]);

  const saveField = async (field: string, value: unknown) => {
    if (!session) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', session.user.id);
      if (error) {
        Alert.alert('Error', 'Could not save. Please try again.');
        return;
      }
      const refreshed = await refreshProfile();
      if (!refreshed) {
        Alert.alert('Error', 'Profile refresh failed. Please try again.');
        return;
      }

      setEditingSection(null);
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const toggleDietary = (option: string) => {
    if (option === 'None') {
      setDietaryPrefs((prev) => (prev.includes('None') ? [] : ['None']));
      return;
    }
    setDietaryPrefs((prev) => {
      const without = prev.filter((s) => s !== 'None');
      return without.includes(option)
        ? without.filter((s) => s !== option)
        : [...without, option];
    });
  };

  const addDislike = () => {
    const trimmed = dislikeInput.trim();
    if (!trimmed) return;

    setDislikedFoods((prev) => normalizeDislikedFoods([...prev, trimmed]));
    setDislikeInput('');
  };

  return (
    <SafeAreaView className="flex-1 bg-kitchen-cream" edges={['bottom']}>
      <Stack.Screen options={{ title: 'Profile' }} />
      <ScrollView className="flex-1" contentContainerClassName="px-6 pb-8">
        {/* User Info */}
        <View className="items-center py-6">
          <View className="w-16 h-16 rounded-full bg-primary-100 items-center justify-center mb-3">
            <Text className="text-3xl">
              {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text className="text-xl font-bold text-kitchen-brown">
            {profile?.display_name ?? 'User'}
          </Text>
          <Text className="text-base text-kitchen-brown/50">
            {session?.user.email}
          </Text>
        </View>

        {/* Dietary Preferences */}
        <View className="bg-white rounded-2xl p-5 border border-kitchen-brown/10 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-kitchen-brown">
              Dietary Preferences
            </Text>
            <Pressable
              onPress={() => {
                if (editingSection === 'dietary') {
                  saveField(
                    'dietary_preferences',
                    normalizeDietaryPreferences(dietaryPrefs),
                  );
                } else {
                  setEditingSection('dietary');
                }
              }}>
              <Text className="text-primary-600 font-medium">
                {editingSection === 'dietary' ? 'Save' : 'Edit'}
              </Text>
            </Pressable>
          </View>
          {editingSection === 'dietary' ? (
            <View className="flex-row flex-wrap gap-2">
              {DIETARY_OPTIONS.map((opt) => {
                const isSelected = dietaryPrefs.includes(opt);
                return (
                  <Pressable
                    key={opt}
                    onPress={() => toggleDietary(opt)}
                    className={`px-3 py-2 rounded-xl border ${
                      isSelected
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-white border-kitchen-brown/20'
                    }`}>
                    <Text
                      className={`text-sm font-medium ${
                        isSelected ? 'text-white' : 'text-kitchen-brown'
                      }`}>
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text className="text-base text-kitchen-brown/60">
              {profile?.dietary_preferences?.length
                ? profile.dietary_preferences.join(', ')
                : 'None set'}
            </Text>
          )}
        </View>

        {/* Disliked Foods */}
        <View className="bg-white rounded-2xl p-5 border border-kitchen-brown/10 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-kitchen-brown">
              Disliked Foods
            </Text>
            <Pressable
              onPress={() => {
                if (editingSection === 'dislikes') {
                  saveField('disliked_foods', normalizeDislikedFoods(dislikedFoods));
                } else {
                  setEditingSection('dislikes');
                }
              }}>
              <Text className="text-primary-600 font-medium">
                {editingSection === 'dislikes' ? 'Save' : 'Edit'}
              </Text>
            </Pressable>
          </View>
          {editingSection === 'dislikes' ? (
            <View>
              <View className="flex-row gap-2 mb-3">
                <TextInput
                  className="flex-1 bg-kitchen-cream border border-kitchen-brown/20 rounded-xl px-3 py-2 text-base text-kitchen-brown"
                  placeholder="Add a food..."
                  placeholderTextColor="#A89880"
                  value={dislikeInput}
                  onChangeText={setDislikeInput}
                  onSubmitEditing={addDislike}
                  returnKeyType="done"
                />
                <Pressable
                  onPress={addDislike}
                  className="bg-primary-500 rounded-xl px-4 justify-center">
                  <Text className="text-white font-bold">+</Text>
                </Pressable>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {dislikedFoods.map((food) => (
                  <Pressable
                    key={food}
                    onPress={() =>
                      setDislikedFoods((prev) =>
                        prev.filter((f) => f !== food),
                      )
                    }
                    className="flex-row items-center gap-1 bg-secondary-100 border border-secondary-300 rounded-xl px-3 py-1">
                    <Text className="text-sm text-kitchen-brown">{food}</Text>
                    <Text className="text-kitchen-brown/50">x</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <Text className="text-base text-kitchen-brown/60">
              {profile?.disliked_foods?.length
                ? profile.disliked_foods.join(', ')
                : 'None set'}
            </Text>
          )}
        </View>

        {/* Shopping Frequency */}
        <View className="bg-white rounded-2xl p-5 border border-kitchen-brown/10 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-kitchen-brown">
              Shopping Frequency
            </Text>
            <Pressable
              onPress={() => {
                if (editingSection === 'frequency') {
                  saveField('shopping_frequency_days', frequency);
                } else {
                  setEditingSection('frequency');
                }
              }}>
              <Text className="text-primary-600 font-medium">
                {editingSection === 'frequency' ? 'Save' : 'Edit'}
              </Text>
            </Pressable>
          </View>
          {editingSection === 'frequency' ? (
            <View className="gap-2">
              {FREQUENCY_OPTIONS.map((opt) => {
                const isSelected = frequency === opt.days;
                return (
                  <Pressable
                    key={opt.days}
                    onPress={() => setFrequency(opt.days)}
                    className={`py-3 px-4 rounded-xl border ${
                      isSelected
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-white border-kitchen-brown/20'
                    }`}>
                    <Text
                      className={`text-sm font-medium ${
                        isSelected ? 'text-white' : 'text-kitchen-brown'
                      }`}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text className="text-base text-kitchen-brown/60">
              {FREQUENCY_OPTIONS.find((o) => o.days === profile?.shopping_frequency_days)
                ?.label ?? `Every ${profile?.shopping_frequency_days} days`}
            </Text>
          )}
        </View>

        {/* Household Size */}
        <View className="bg-white rounded-2xl p-5 border border-kitchen-brown/10 mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-kitchen-brown">
              Household Size
            </Text>
            <Pressable
              onPress={() => {
                if (editingSection === 'household') {
                  saveField('household_size', householdSize);
                } else {
                  setEditingSection('household');
                }
              }}>
              <Text className="text-primary-600 font-medium">
                {editingSection === 'household' ? 'Save' : 'Edit'}
              </Text>
            </Pressable>
          </View>
          {editingSection === 'household' ? (
            <View className="flex-row items-center gap-6 justify-center py-2">
              <Pressable
                onPress={() =>
                  setHouseholdSize((s) => Math.max(1, s - 1))
                }
                className="w-10 h-10 rounded-full bg-kitchen-cream border border-kitchen-brown/20 items-center justify-center">
                <Text className="text-lg text-kitchen-brown">-</Text>
              </Pressable>
              <Text className="text-3xl font-bold text-primary-600">
                {householdSize}
              </Text>
              <Pressable
                onPress={() =>
                  setHouseholdSize((s) => Math.min(8, s + 1))
                }
                className="w-10 h-10 rounded-full bg-kitchen-cream border border-kitchen-brown/20 items-center justify-center">
                <Text className="text-lg text-kitchen-brown">+</Text>
              </Pressable>
            </View>
          ) : (
            <Text className="text-base text-kitchen-brown/60">
              {profile?.household_size === 1
                ? '1 person'
                : `${profile?.household_size} people`}
            </Text>
          )}
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={handleSignOut}
          className="w-full py-4 items-center rounded-2xl border border-kitchen-rust/30 active:bg-kitchen-rust/5">
          <Text className="text-kitchen-rust text-base font-semibold">
            Sign Out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
