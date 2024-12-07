// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      const inAuthGroup = segments[0] === '(auth)';
      
      if (!user && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (user && segments[0] === '+not-found') {
        router.replace('/(app)/events');
      }
    });

    return unsubscribe;
  }, [segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}