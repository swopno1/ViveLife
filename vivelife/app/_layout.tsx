import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../src/stores/auth';

export default function AppLayout() {
  const { session, checkSession } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (session && !inAuthGroup) {
      // Redirect authenticated users to the main app
      router.replace('/(tabs)/note');
    } else if (!session) {
      // Redirect unauthenticated users to the sign-in screen
      router.replace('/sign-in');
    }
  }, [session, segments, router]);

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
