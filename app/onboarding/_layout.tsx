import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { ProfileLoadError } from '@/components/profile-load-error';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function OnboardingLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { profile, profileError, isProfileLoading } = useAuth();

  if (isProfileLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-kitchen-cream">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (profileError) {
    return <ProfileLoadError />;
  }

  if (profile?.onboarding_completed_at) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
