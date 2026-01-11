import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../src/stores/auth';

export default function AppLayout() {
  const { session, checkSession } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await checkSession();
      setIsReady(true);
    }
    prepare();
  }, [checkSession]);

  useEffect(() => {
    if (!isReady) return;

    const isAuthRoute = ['sign-in', 'sign-up', 'forgot-password'].includes(
      segments[0] as string
    );

    if (session && isAuthRoute) {
      // User is logged in but on an auth page, send them to the app's home.
      router.replace('/');
    } else if (!session && !isAuthRoute) {
      // User is not logged in and not on an auth page, send them to sign-in.
      router.replace('/sign-in');
    }
  }, [session, segments, router, isReady]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
