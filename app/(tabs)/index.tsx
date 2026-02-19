import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const displayName = profile?.display_name?.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView className="flex-1 bg-kitchen-cream" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
        <View>
          <Text className="text-2xl font-bold text-kitchen-brown">
            Hi, {displayName}!
          </Text>
          <Text className="text-base text-kitchen-brown/60">
            What&apos;s cooking today?
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/profile')}
          className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center">
          <IconSymbol
            name="person.circle"
            size={24}
            color={colors.primary}
          />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="pb-8 gap-4">
        <View className="bg-white rounded-2xl p-5 border border-kitchen-brown/10">
          <Text className="text-lg font-semibold text-kitchen-brown mb-1">
            Daily Check-in
          </Text>
          <Text className="text-base text-kitchen-brown/60">
            What did you cook or eat today? Quick updates help us learn your
            habits.
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-5 border border-kitchen-brown/10">
          <Text className="text-lg font-semibold text-kitchen-brown mb-1">
            Your Kitchen
          </Text>
          <Text className="text-base text-kitchen-brown/60">
            Start adding items to your inventory to get personalized
            suggestions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
