import { Session, User } from '@supabase/supabase-js';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';

const redirectTo = makeRedirectUri();

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  profileError: string | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  isProfileReady: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const profileRequestRef = useRef(0);

  const ensureProfile = useCallback(async (user: User) => {
    const metadataName =
      typeof user.user_metadata?.name === 'string'
        ? user.user_metadata.name.trim()
        : '';

    const { error } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        display_name: metadataName || null,
      },
      { onConflict: 'id', ignoreDuplicates: true },
    );

    if (error) {
      console.error('Error ensuring profile:', error.message);
      setProfileError(error.message);
      return false;
    }

    return true;
  }, []);

  const loadProfileForSession = useCallback(
    async (nextSession: Session | null) => {
      const requestId = ++profileRequestRef.current;

      if (!nextSession?.user) {
        setProfile(null);
        setProfileError(null);
        setIsProfileLoading(false);
        return false;
      }

      setIsProfileLoading(true);
      setProfileError(null);

      const ensuredProfile = await ensureProfile(nextSession.user);
      if (profileRequestRef.current !== requestId) {
        return false;
      }

      if (!ensuredProfile) {
        setProfile(null);
        setIsProfileLoading(false);
        return false;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', nextSession.user.id)
        .single();

      if (profileRequestRef.current !== requestId) {
        return false;
      }

      if (error) {
        console.error('Error fetching profile:', error.message);
        setProfile(null);
        setProfileError(error.message);
        setIsProfileLoading(false);
        return false;
      }

      setProfile(data as Profile);
      setProfileError(null);
      setIsProfileLoading(false);
      return true;
    },
    [ensureProfile],
  );

  const refreshProfile = useCallback(async () => {
    if (!session) {
      setProfile(null);
      setProfileError(null);
      return false;
    }

    return loadProfileForSession(session);
  }, [session, loadProfileForSession]);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!isMounted) return;
      setSession(s);
      await loadProfileForSession(s);
      if (isMounted) {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      void loadProfileForSession(s).finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    });

    return () => {
      isMounted = false;
      profileRequestRef.current += 1;
      subscription.unsubscribe();
    };
  }, [loadProfileForSession]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    },
    [],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    },
    [],
  );

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectTo,
    );

    if (result.type !== 'success') return;

    const { params, errorCode } = QueryParams.getQueryParams(result.url);

    if (errorCode) throw new Error(errorCode);

    const { code } = params;

    if (!code) {
      throw new Error('Missing auth code from OAuth response');
    }

    const { error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) throw sessionError;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setProfileError(null);
    setIsProfileLoading(false);
  }, []);

  const isProfileReady = useMemo(
    () => !!profile && !isProfileLoading && !profileError,
    [profile, isProfileLoading, profileError],
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        profileError,
        isLoading,
        isProfileLoading,
        isProfileReady,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
