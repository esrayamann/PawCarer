import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: { fontWeight: '700', color: Colors.textPrimary },
          contentStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
          headerBackTitle: 'Geri',
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile/edit"
          options={{ title: 'Profili Düzenle', presentation: 'modal' }}
        />
        <Stack.Screen
          name="pets/new"
          options={{ title: 'Hayvan Ekle', presentation: 'modal' }}
        />
        <Stack.Screen
          name="admin/index"
          options={{ title: 'Admin Paneli' }}
        />
        <Stack.Screen
          name="reviews/[reviewId]/edit"
          options={{ title: 'Yorumu Düzenle', presentation: 'modal' }}
        />
        <Stack.Screen
          name="sitters/[id]"
          options={{ title: 'Bakıcı Profili' }}
        />
      </Stack>
    </AuthProvider>
  );
}
