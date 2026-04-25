import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { petService } from '../../services/petService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

const PET_TYPES = ['Kedi', 'Köpek', 'Kuş', 'Tavşan', 'Hamster', 'Diğer'];

const PET_TYPE_ICONS: Record<string, string> = {
  Kedi: '🐱',
  Köpek: '🐶',
  Kuş: '🐦',
  Tavşan: '🐰',
  Hamster: '🐹',
  Diğer: '🐾',
};

export default function NewPetScreen() {
  const [name, setName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; petType?: string; breed?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Hayvan adı zorunludur';
    if (!petType) newErrors.petType = 'Hayvan türü seçiniz';
    if (!breed.trim()) newErrors.breed = 'Cins zorunludur';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await petService.createPet({
        name: name.trim(),
        petType,
        breed: breed.trim(),
        age: age ? parseInt(age, 10) : undefined,
        notes: notes.trim() || undefined,
      });
      Alert.alert('Başarılı! 🐾', `${name} profilinize eklendi!`, [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Hata', 'Hayvan profili oluşturulamadı. Tekrar deneyin.');
    } finally {
      setLoading(false);
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🐾</Text>
          <Text style={styles.title}>Yeni Hayvan Profili</Text>
          <Text style={styles.subtitle}>Evcil hayvanınızı sisteme ekleyin</Text>
        </View>

        {/* Tür Seçimi */}
        <Text style={styles.label}>Hayvan Türü *</Text>
        <View style={styles.typeGrid}>
          {PET_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeCard, petType === type && styles.typeCardActive]}
              onPress={() => { setPetType(type); setErrors((e) => ({ ...e, petType: undefined })); }}
            >
              <Text style={styles.typeEmoji}>{PET_TYPE_ICONS[type]}</Text>
              <Text style={[styles.typeText, petType === type && styles.typeTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.petType && <Text style={styles.errorText}>{errors.petType}</Text>}

        <View style={styles.formSection}>
          <Input
            label="Hayvan Adı *"
            placeholder="Örn: Leo"
            value={name}
            onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }}
            error={errors.name}
            leftIcon="paw-outline"
          />

          <Input
            label="Cins *"
            placeholder="Örn: British Shorthair"
            value={breed}
            onChangeText={(t) => { setBreed(t); setErrors((e) => ({ ...e, breed: undefined })); }}
            error={errors.breed}
            leftIcon="ribbon-outline"
          />

          <Input
            label="Yaş"
            placeholder="Örn: 2"
            value={age}
            onChangeText={setAge}
            leftIcon="calendar-outline"
            keyboardType="number-pad"
          />

          <View style={styles.notesWrapper}>
            <Text style={styles.notesLabel}>Özel Notlar</Text>
            <Input
              placeholder="Bakım için özel bilgiler, alerjiler vb."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
        </View>

        <Button
          title="Profil Oluştur"
          onPress={handleCreate}
          loading={loading}
          size="lg"
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  emoji: { fontSize: 48, marginBottom: Spacing.sm },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.base,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.sm,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  typeCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeCardActive: {
    backgroundColor: Colors.primary + '22',
    borderColor: Colors.primary,
  },
  typeEmoji: { fontSize: 28, marginBottom: 4 },
  typeText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  typeTextActive: { color: Colors.primary },
  errorText: {
    color: Colors.error,
    fontSize: Typography.fontSize.xs,
    marginBottom: Spacing.sm,
  },
  formSection: { marginTop: Spacing.md },
  notesLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  notesWrapper: { marginBottom: Spacing.md },
  submitBtn: { marginTop: Spacing.md },
});
