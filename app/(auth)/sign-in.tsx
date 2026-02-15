import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';

export default function SignInScreen() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password);
        Alert.alert('Account created', 'You can now sign in.');
        setIsSignUp(false);
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (error: unknown) {
      const typedError = error as { message?: string };
      Alert.alert(
        isSignUp ? 'Sign Up Error' : 'Sign In Error',
        typedError.message ?? 'Something went wrong.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      const typedError = error as { message?: string };
      Alert.alert(
        'Sign In Error',
        typedError.message ?? 'Something went wrong.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-kitchen-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-8">
        <Text className="text-3xl font-bold text-kitchen-brown text-center mb-2">
          {isSignUp ? 'Create Account' : 'Welcome back'}
        </Text>
        <Text className="text-base text-kitchen-brown/60 text-center mb-8">
          {isSignUp
            ? 'Sign up to get started'
            : 'Sign in to your kitchen'}
        </Text>

        <View className="gap-3 mb-6">
          <TextInput
            className="bg-white border border-kitchen-brown/20 rounded-2xl px-4 py-4 text-base text-kitchen-brown"
            placeholder="Email"
            placeholderTextColor="#A89880"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextInput
            className="bg-white border border-kitchen-brown/20 rounded-2xl px-4 py-4 text-base text-kitchen-brown"
            placeholder="Password"
            placeholderTextColor="#A89880"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType={isSignUp ? 'newPassword' : 'password'}
          />
        </View>

        <Pressable
          onPress={handleEmailAuth}
          disabled={loading}
          className="w-full bg-primary-600 rounded-2xl py-4 items-center mb-4 active:bg-primary-700">
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={() => setIsSignUp((v) => !v)} className="mb-8">
          <Text className="text-center text-kitchen-brown/60 text-base">
            {isSignUp
              ? 'Already have an account? '
              : "Don't have an account? "}
            <Text className="text-primary-600 font-medium">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Text>
          </Text>
        </Pressable>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-kitchen-brown/15" />
          <Text className="mx-4 text-kitchen-brown/40 text-sm">or</Text>
          <View className="flex-1 h-px bg-kitchen-brown/15" />
        </View>

        <Pressable
          onPress={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-kitchen-brown/20 rounded-2xl py-4 flex-row items-center justify-center gap-3 active:bg-gray-50">
          <Text className="text-2xl">G</Text>
          <Text className="text-base font-semibold text-kitchen-brown">
            Continue with Google
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
