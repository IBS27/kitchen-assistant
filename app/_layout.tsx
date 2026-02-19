import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore duplicate calls during fast refresh.
});

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { session, isLoading, isProfileReady, profileError } = useAuth();
  const hasHiddenSplashRef = useRef(false);

  const isAuthStateReady =
    !isLoading && (!session || isProfileReady || !!profileError);

  useEffect(() => {
    if (!isAuthStateReady || hasHiddenSplashRef.current) {
      return;
    }

    hasHiddenSplashRef.current = true;

    void SplashScreen.hideAsync().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      // iOS can race when the splash is already dismissed for this controller.
      if (!message.includes('No native splash screen registered')) {
        console.warn('Failed to hide splash screen:', error);
      }
    });
  }, [isAuthStateReady]);

  if (!isAuthStateReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile"
            options={{ presentation: 'modal', title: 'Profile' }}
          />
        </Stack.Protected>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
