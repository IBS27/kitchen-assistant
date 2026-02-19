import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const SECURE_STORE_CHUNK_CHAR_LIMIT = 400;

function chunkCountKey(key: string) {
  return `${key}.__chunks`;
}

function chunkKey(key: string, index: number) {
  return `${key}.__part.${index}`;
}

async function getStoredChunkCount(key: string) {
  const rawCount = await SecureStore.getItemAsync(chunkCountKey(key));
  if (!rawCount) return 0;

  const parsed = Number.parseInt(rawCount, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

async function clearChunkedValue(key: string) {
  const count = await getStoredChunkCount(key);

  if (count > 0) {
    await Promise.all(
      Array.from({ length: count }, (_, index) =>
        SecureStore.deleteItemAsync(chunkKey(key, index)),
      ),
    );
  }

  await SecureStore.deleteItemAsync(chunkCountKey(key));
}

async function setSecureStoreValue(key: string, value: string) {
  if (value.length <= SECURE_STORE_CHUNK_CHAR_LIMIT) {
    await clearChunkedValue(key);
    await SecureStore.setItemAsync(key, value);
    return;
  }

  const previousCount = await getStoredChunkCount(key);
  const chunkCount = Math.ceil(value.length / SECURE_STORE_CHUNK_CHAR_LIMIT);

  await SecureStore.deleteItemAsync(key);

  await Promise.all(
    Array.from({ length: chunkCount }, (_, index) => {
      const start = index * SECURE_STORE_CHUNK_CHAR_LIMIT;
      const end = start + SECURE_STORE_CHUNK_CHAR_LIMIT;
      return SecureStore.setItemAsync(chunkKey(key, index), value.slice(start, end));
    }),
  );

  await SecureStore.setItemAsync(chunkCountKey(key), String(chunkCount));

  if (previousCount > chunkCount) {
    await Promise.all(
      Array.from({ length: previousCount - chunkCount }, (_, index) =>
        SecureStore.deleteItemAsync(chunkKey(key, chunkCount + index)),
      ),
    );
  }
}

async function getSecureStoreValue(key: string) {
  const count = await getStoredChunkCount(key);

  if (count === 0) {
    return SecureStore.getItemAsync(key);
  }

  const chunks = await Promise.all(
    Array.from({ length: count }, (_, index) =>
      SecureStore.getItemAsync(chunkKey(key, index)),
    ),
  );

  if (chunks.some((chunk) => chunk === null)) {
    return null;
  }

  return chunks.join('');
}

async function removeSecureStoreValue(key: string) {
  await Promise.all([SecureStore.deleteItemAsync(key), clearChunkedValue(key)]);
}

const secureStoreAdapter =
  Platform.OS !== 'web'
    ? {
        getItem: (key: string) => getSecureStoreValue(key),
        setItem: (key: string, value: string) =>
          setSecureStoreValue(key, value),
        removeItem: (key: string) => removeSecureStoreValue(key),
      }
    : undefined;

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
