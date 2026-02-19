import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-kitchen-cream">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-6xl mb-4">🍳</Text>
        <Text className="text-4xl font-bold text-primary-700 mb-2">
          Kitchen Assistant
        </Text>
        <Text className="text-lg text-kitchen-brown/70 text-center mb-12">
          Your kitchen, organized
        </Text>

        <View className="w-full gap-6 mb-12">
          <View className="flex-row items-center gap-4">
            <Text className="text-2xl">📦</Text>
            <Text className="text-base text-kitchen-brown flex-1">
              Track what&apos;s in your kitchen
            </Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Text className="text-2xl">🍽️</Text>
            <Text className="text-base text-kitchen-brown flex-1">
              Get meal ideas from what you have
            </Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Text className="text-2xl">🛒</Text>
            <Text className="text-base text-kitchen-brown flex-1">
              Smart shopping lists, less waste
            </Text>
          </View>
        </View>

        <Pressable
          className="w-full bg-primary-600 rounded-2xl py-4 items-center active:bg-primary-700"
          onPress={() => router.push('/(auth)/sign-in')}>
          <Text className="text-white text-lg font-semibold">Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
