import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  const hasChanges =
    fullName !== (user?.fullName ?? '') ||
    location !== (user?.location ?? '') ||
    phoneNumber !== (user?.phoneNumber ?? '');

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Ad Soyad boş bırakılamaz';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !user?.id) return;
    setLoading(true);
    try {
      // Sadece değişen alanları gönder (partial update)
      const payload: Record<string, string> = {};
      if (fullName !== user.fullName) payload.fullName = fullName.trim();
      if (location !== (user.location ?? '')) payload.location = location.trim();
      if (phoneNumber !== (user.phoneNumber ?? '')) payload.phoneNumber = phoneNumber.trim();

      const updated = await userService.updateUser(user.id, payload);
      updateUser(updated);
      router.back();
    } catch (err: any) {
      Alert.alert('Hata', 'Profil güncellenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Değişiklikler Kaydedilmedi',
        'Yaptığınız değişiklikler kaybolacak. Çıkmak istiyor musunuz?',
        [
          { text: 'Hayır', style: 'cancel' },
          { text: 'Evet, Çık', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

        <Input
          label="Ad Soyad"
          placeholder="Adınız ve soyadınız"
          value={fullName}
          onChangeText={(t) => { setFullName(t); setErrors((e) => ({ ...e, fullName: undefined })); }}
          error={errors.fullName}
          leftIcon="person-outline"
          autoCapitalize="words"
        />

        <Input
          label="Email"
          value={user?.email ?? ''}
          editable={false}
          leftIcon="mail-outline"
          containerStyle={{ opacity: 0.5 }}
        />

        <Input
          label="Konum"
          placeholder="Örn: Kadıköy, İstanbul"
          value={location}
          onChangeText={setLocation}
          leftIcon="location-outline"
        />

        <Input
          label="Telefon"
          placeholder="05XX XXX XX XX"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          leftIcon="call-outline"
          keyboardType="phone-pad"
        />

        <View style={styles.btnRow}>
          <Button
            title="İptal"
            onPress={handleCancel}
            variant="secondary"
            style={styles.btn}
          />
          <Button
            title="Kaydet"
            onPress={handleSave}
            loading={loading}
            disabled={!hasChanges}
            style={styles.btn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  btn: { flex: 1 },
});
