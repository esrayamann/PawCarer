import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { sitterService, SitterUpdatePayload } from '../../services/sitterService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function SitterEditScreen() {
  const { user } = useAuth();

  const [sitterId, setSitterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');
  const [acceptedPetTypes, setAcceptedPetTypes] = useState('');
  const [acceptedPetBreeds, setAcceptedPetBreeds] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const profile = await sitterService.getMySitterProfile(user.id);
        if (profile) {
          setSitterId(profile.id);
          setHourlyRate(profile.hourlyRate?.toString() ?? '');
          setBio(profile.bio ?? '');
          setAcceptedPetTypes((profile.acceptedPetTypes ?? []).join(', '));
          setAcceptedPetBreeds((profile.acceptedPetBreeds ?? []).join(', '));
        } else {
          Alert.alert('Uyarı', 'Henüz bir bakıcı profiliniz bulunmuyor.');
          router.back();
        }
      } catch {
        Alert.alert('Hata', 'Profil bilgileri yüklenemedi.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const handleSave = async () => {
    if (!sitterId) return;

    const rate = parseFloat(hourlyRate);
    if (hourlyRate && (isNaN(rate) || rate < 0)) {
      Alert.alert('Hata', 'Geçerli bir saatlik ücret giriniz.');
      return;
    }

    setSaving(true);
    try {
      const payload: SitterUpdatePayload = {
        ...(hourlyRate ? { hourlyRate: rate } : {}),
        ...(bio.trim() ? { bio: bio.trim() } : {}),
        ...(acceptedPetTypes.trim()
          ? { acceptedPetTypes: acceptedPetTypes.split(',').map((s) => s.trim()).filter(Boolean) }
          : {}),
        ...(acceptedPetBreeds.trim()
          ? { acceptedPetBreeds: acceptedPetBreeds.split(',').map((s) => s.trim()).filter(Boolean) }
          : {}),
      };

      await sitterService.updateSitter(sitterId, payload);
      Alert.alert('Başarılı', 'Bakıcı profiliniz güncellendi.', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Hata', 'Profil güncellenirken bir sorun oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Profil yükleniyor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.headerIcon}>🐾</Text>
          <Text style={styles.headerTitle}>Bakıcı Profilini Düzenle</Text>
          <Text style={styles.headerSubtitle}>
            Bilgilerini güncelleyerek daha fazla hayvan sahibine ulaş.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>Saatlik Ücret (₺)</Text>
          <Input
            value={hourlyRate}
            onChangeText={setHourlyRate}
            placeholder="Örn: 150"
            keyboardType="numeric"
          />

          <Text style={styles.sectionLabel}>Hakkımda / Bio</Text>
          <Input
            value={bio}
            onChangeText={setBio}
            placeholder="Kendinizi tanıtın..."
            multiline
            numberOfLines={4}
          />

          <Text style={styles.sectionLabel}>Kabul Ettiğiniz Hayvan Türleri</Text>
          <Text style={styles.hint}>Virgülle ayırın (örn: Köpek, Kedi)</Text>
          <Input
            value={acceptedPetTypes}
            onChangeText={setAcceptedPetTypes}
            placeholder="Köpek, Kedi, Kuş..."
          />

          <Text style={styles.sectionLabel}>Kabul Ettiğiniz Irklar</Text>
          <Text style={styles.hint}>Virgülle ayırın (örn: Labrador, Golden)</Text>
          <Input
            value={acceptedPetBreeds}
            onChangeText={setAcceptedPetBreeds}
            placeholder="Labrador, Golden, Husky..."
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Değişiklikleri Kaydet"
            onPress={handleSave}
            variant="primary"
            size="lg"
            loading={saving}
          />
          <Button
            title="Vazgeç"
            onPress={() => router.back()}
            variant="secondary"
            size="lg"
            disabled={saving}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.base,
  },
  headerCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  headerIcon: { fontSize: 48, marginBottom: Spacing.sm },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.sm,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: 2,
  },
  hint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  actions: { gap: Spacing.sm },
});
