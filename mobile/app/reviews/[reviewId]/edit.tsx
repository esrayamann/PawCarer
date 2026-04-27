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
import { useLocalSearchParams, router } from 'expo-router';
import { reviewService } from '../../../services/reviewService';
import { StarRow } from '../../../components/ui/StarRating';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';

export default function EditReviewScreen() {
  const { reviewId, initialRating, initialComment } = useLocalSearchParams<{
    reviewId: string;
    initialRating?: string;
    initialComment?: string;
  }>();
  const [rating, setRating] = useState(initialRating ? parseInt(initialRating) : 3);
  const [comment, setComment] = useState(initialComment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (!comment.trim()) {
      setError('Yorum alanı boş bırakılamaz');
      return;
    }
    if (!reviewId) {
      Alert.alert('Hata', 'Yorum ID bulunamadı.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await reviewService.updateReview(reviewId, { rating, comment: comment.trim() });
      Alert.alert('Başarılı', 'Yorumunuz güncellendi!', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        setError('Bu yorumu düzenleme yetkiniz yok.');
      } else {
        setError('Yorum güncellenemedi. Lütfen tekrar deneyin.');
      }
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
        {/* Yıldız Seçimi */}
        <View style={styles.starSection}>
          <Text style={styles.starLabel}>Puanınız</Text>
          <StarRow rating={rating} onRate={setRating} size={40} />
          <Text style={styles.ratingValue}>{rating} / 5</Text>
        </View>

        {/* Yorum */}
        <Text style={styles.sectionLabel}>Yorumunuz</Text>
        <View style={styles.textAreaWrapper}>
          <Input
            placeholder="Bakıcı hakkında düşüncelerinizi yazın..."
            value={comment}
            onChangeText={(t) => { setComment(t); setError(''); }}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            containerStyle={{ marginBottom: 0 }}
          />
        </View>

        {error !== '' && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <View style={styles.btnRow}>
          <Button
            title="Vazgeç"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.btn}
            disabled={loading}
          />
          <Button
            title="Değişiklikleri Kaydet"
            onPress={handleUpdate}
            loading={loading}
            disabled={!comment.trim()}
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
  starSection: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  starLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingValue: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.md,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textAreaWrapper: { marginBottom: Spacing.md },
  errorText: {
    color: Colors.error,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.md,
  },
  btnRow: { flexDirection: 'row', gap: Spacing.sm },
  btn: { flex: 1 },
});
