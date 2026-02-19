import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5 bg-kitchen-cream">
        <Text className="text-xl font-bold text-kitchen-brown mb-4">
          This screen doesn&apos;t exist.
        </Text>
        <Link href="/">
          <Text className="text-primary-600 text-base">Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}
