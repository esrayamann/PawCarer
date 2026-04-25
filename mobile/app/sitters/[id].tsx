import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sitterService, SitterDetail } from '../../services/sitterService';
import { useAuth } from '../../context/AuthContext';
import { StarRow } from '../../components/ui/StarRating';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

const PET_ICON: Record<string, string> = {
  Kedi: '🐱', Köpek: '🐶', Kuş: '🦜', Tavşan: '🐰', Balık: '🐟', Diğer: '🐾',
};

export default function SitterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [sitter, setSitter] = useState<SitterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Yorum formu
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSitter = useCallback(async () => {
    if (!id) return;
    try {
      const data = await sitterService.getSitterById(id);
      setSitter(data);
    } catch (err: any) {
      setNotFound(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => { fetchSitter(); }, [fetchSitter]);

  const onRefresh = () => { setRefreshing(true); fetchSitter(); };

  const submitReview = async () => {
    if (!user) {
      setReviewMsg({ type: 'error', text: 'Yorum yapabilmek için giriş yapmanız gerekiyor.' });
      return;
    }
    if (!comment.trim()) {
      setReviewMsg({ type: 'error', text: 'Yorum boş bırakılamaz.' });
      return;
    }
    setSubmitting(true);
    setReviewMsg(null);
    try {
      await sitterService.addReview(id!, { rating, comment: comment.trim() });
      setReviewMsg({ type: 'success', text: 'Yorumunuz başarıyla gönderildi! ⭐' });
      setComment('');
      setRating(5);
      fetchSitter();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Yorum gönderilemedi.';
      setReviewMsg({ type: 'error', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  // --- LOADING ---
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.secondary} size="large" />
        <Text style={styles.loadingText}>Profil yükleniyor...</Text>
      </View>
    );
  }

  // --- NOT FOUND ---
  if (notFound || !sitter) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 50 }}>🔍</Text>
        <Text style={styles.notFoundTitle}>Bakıcı Bulunamadı</Text>
        <Text style={styles.notFoundSub}>Bu profil mevcut değil veya silinmiş olabilir.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const initials = sitter.fullName
    ? sitter.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.secondary} />}
      >
        {/* Geri butonu */}
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={Colors.textMuted} />
          <Text style={styles.backText}>Arama Sonuçlarına Dön</Text>
        </TouchableOpacity>

        {/* ── BAŞLIK KARTI ── */}
        <View style={styles.heroCard}>
          {/* Gradient header band */}
          <View style={styles.heroHeader}>
            <View style={styles.heroAvatar}>
              <Text style={styles.heroAvatarText}>{initials}</Text>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{sitter.fullName}</Text>
              <View style={styles.heroRow}>
                <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.heroLocation}>{sitter.location || 'Konum belirtilmemiş'}</Text>
              </View>
              <View style={styles.heroBadges}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingBadgeText}>
                    ★ {sitter.averageRating ? Number(sitter.averageRating).toFixed(1) : '—'}
                    {'  '}
                    <Text style={styles.ratingBadgeSub}>({sitter.totalReviews ?? 0} yorum)</Text>
                  </Text>
                </View>
                {sitter.hourlyRate ? (
                  <View style={styles.rateBadge}>
                    <Text style={styles.rateBadgeText}>₺{sitter.hourlyRate}<Text style={styles.rateBadgeSub}> /saat</Text></Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          {/* Body */}
          <View style={styles.heroBody}>
            {/* Bio */}
            {sitter.bio ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>HAKKINDA</Text>
                <Text style={styles.bioText}>{sitter.bio}</Text>
              </View>
            ) : null}

            {/* Hayvan Türleri */}
            {sitter.acceptedPetTypes && sitter.acceptedPetTypes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>BAKTIĞI HAYVAN TÜRLERİ</Text>
                <View style={styles.tagRow}>
                  {sitter.acceptedPetTypes.map((t) => (
                    <View key={t} style={styles.petTag}>
                      <Text style={styles.petTagText}>{PET_ICON[t] || '🐾'} {t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Cinsler */}
            {sitter.acceptedPetBreeds && sitter.acceptedPetBreeds.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>UZMAN OLDUĞU CİNSLER</Text>
                <View style={styles.tagRow}>
                  {sitter.acceptedPetBreeds.map((b) => (
                    <View key={b} style={styles.breedTag}>
                      <Text style={styles.breedTagText}>{b}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ── YORUM YAZMA ── */}
        <View style={styles.reviewCard}>
          <Text style={styles.cardTitle}>⭐ Yorum Bırak</Text>

          {reviewMsg && (
            <View style={[styles.msgBox, reviewMsg.type === 'error' ? styles.msgError : styles.msgSuccess]}>
              <Text style={[styles.msgText, reviewMsg.type === 'error' ? styles.msgTextError : styles.msgTextSuccess]}>
                {reviewMsg.text}
              </Text>
            </View>
          )}

          <Text style={styles.fieldLabel}>Puanınız</Text>
          <StarRow rating={rating} onRate={setRating} size={36} />

          <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Yorumunuz</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Bu bakıcıyla deneyiminizi paylaşın..."
            placeholderTextColor={Colors.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={submitReview}
            disabled={submitting}
          >
            <Text style={styles.submitBtnText}>
              {submitting ? 'Gönderiliyor...' : user ? 'Yorum Gönder' : 'Yorum için giriş yapın'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── YORUMLAR LİSTESİ ── */}
        <View style={styles.reviewListCard}>
          <Text style={styles.cardTitle}>
            💬 Tüm Yorumlar{' '}
            <Text style={styles.reviewCountLabel}>({sitter.totalReviews ?? 0})</Text>
          </Text>

          {!sitter.reviews || sitter.reviews.length === 0 ? (
            <View style={styles.emptyReviews}>
              <Text style={{ fontSize: 36 }}>✨</Text>
              <Text style={styles.emptyReviewsText}>Henüz yorum yok. İlk yorumu siz yazın!</Text>
            </View>
          ) : (
            sitter.reviews.map((r, idx) => (
              <View key={r.id} style={[styles.reviewItem, idx < sitter.reviews.length - 1 && styles.reviewDivider]}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{r.reviewerName || 'Anonim'}</Text>
                  <Text style={styles.reviewStars}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </Text>
                </View>
                {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  centered: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center', padding: Spacing.xl,
  },
  loadingText: { color: Colors.textMuted, marginTop: Spacing.md, fontSize: Typography.fontSize.base },
  notFoundTitle: {
    color: Colors.primary, fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold, marginTop: Spacing.md,
  },
  notFoundSub: { color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm },
  backBtn: {
    marginTop: Spacing.lg, backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  backBtnText: { color: '#fff', fontWeight: Typography.fontWeight.bold },

  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  backText: { color: Colors.textMuted, fontSize: Typography.fontSize.sm, marginLeft: 6 },

  // Hero card
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceHigh,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244,123,32,0.1)',
  },
  heroAvatar: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  heroAvatarText: {
    color: '#fff',
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.extrabold,
  },
  heroInfo: { flex: 1 },
  heroName: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 4,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  heroLocation: { color: Colors.textMuted, fontSize: Typography.fontSize.sm, marginLeft: 4 },
  heroBadges: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  ratingBadge: {
    backgroundColor: '#FFFBEB',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ratingBadgeText: {
    color: '#D97706',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  ratingBadgeSub: { fontWeight: Typography.fontWeight.regular, color: '#F59E0B' },
  rateBadge: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(244,123,32,0.2)',
  },
  rateBadgeText: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  rateBadgeSub: { fontWeight: Typography.fontWeight.regular },

  heroBody: { padding: Spacing.md },
  section: { marginBottom: Spacing.md },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  bioText: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, lineHeight: 22 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  petTag: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(244,123,32,0.2)',
  },
  petTagText: { color: Colors.secondary, fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold },
  breedTag: {
    backgroundColor: '#F9FAFB',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  breedTagText: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },

  // Review write
  reviewCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  cardTitle: {
    color: Colors.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  msgBox: {
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  msgError: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  msgSuccess: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  msgText: { fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.medium },
  msgTextError: { color: '#DC2626' },
  msgTextSuccess: { color: '#16A34A' },
  fieldLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
  },
  textarea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    minHeight: 100,
    marginBottom: Spacing.md,
  },
  submitBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: {
    color: '#fff',
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.base,
  },

  // Review list
  reviewListCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  reviewCountLabel: { color: Colors.textMuted, fontSize: Typography.fontSize.base, fontWeight: Typography.fontWeight.regular },
  emptyReviews: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyReviewsText: { color: Colors.textMuted, marginTop: Spacing.sm, textAlign: 'center' },
  reviewItem: { paddingVertical: Spacing.md },
  reviewDivider: { borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  reviewerName: { color: Colors.textPrimary, fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.semibold },
  reviewStars: { color: '#F59E0B', fontSize: Typography.fontSize.sm, fontWeight: Typography.fontWeight.bold },
  reviewComment: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, lineHeight: 20 },
});
