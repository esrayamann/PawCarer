import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { router } from 'expo-router';

// ── Tüm hook'lar koşulsuz olarak burada — React rules of hooks uyumlu ──
export default function AdminScreen() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [sitters, setSitters] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setError('');
    try {
      const [u, r, s] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllReviews(),
        adminService.getAllSitters(),
      ]);
      setUsers(u);
      setReviews(r);
      setSitters(s);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Veriler yüklenemedi.';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Admin değilse veri çekme
    if (user?.role === 'ADMIN') {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user?.role, loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // ── Role check SONRA (hook'lardan sonra) ──
  if (!user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.secondary} size="large" />
      </View>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <View style={styles.denied}>
        <Ionicons name="ban-outline" size={64} color={Colors.error} />
        <Text style={styles.deniedTitle}>Erişim Reddedildi</Text>
        <Text style={styles.deniedSubtitle}>Bu sayfayı görüntüleme yetkiniz yok.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.secondary} size="large" />
        <Text style={styles.loadingText}>Admin paneli yükleniyor...</Text>
      </View>
    );
  }

  // ── Yorum silme ──
  const handleDeleteReview = (reviewId: string, preview: string) => {
    Alert.alert(
      'Yorumu Sil',
      `"${preview}" yorumunu kalıcı olarak silmek istiyor musunuz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteReview(reviewId);
              setReviews((prev) => prev.filter((r) => r.id !== reviewId));
            } catch (err: any) {
              Alert.alert('Hata', err?.response?.data?.message || 'Yorum silinemedi.');
            }
          },
        },
      ]
    );
  };

  // ── Bakıcı silme ──
  const handleDeleteSitter = (sitterId: string, name: string) => {
    Alert.alert(
      'Bakıcıyı Sil',
      `"${name}" adlı bakıcıyı kalıcı olarak silmek istiyor musunuz?\n\nBu işlem geri alınamaz.`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteSitter(sitterId);
              setSitters((prev) => prev.filter((s) => s.id !== sitterId));
            } catch (err: any) {
              Alert.alert('Hata', err?.response?.data?.message || 'Bakıcı silinemedi.');
            }
          },
        },
      ]
    );
  };

  // ── Kullanıcı silme ──
  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Kullanıcıyı Sil',
      `"${userName}" adlı kullanıcıyı kalıcı olarak silmek istiyor musunuz?\n\nBu işlem geri alınamaz.`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteUser(userId);
              setUsers((prev) => prev.filter((u) => u.id !== userId));
            } catch (err: any) {
              Alert.alert('Hata', err?.response?.data?.message || 'Kullanıcı silinemedi.');
            }
          },
        },
      ]
    );
  };

  // ── Rol güncelleme ──
  const handleRoleChange = (userId: string, userName: string, newRole: 'OWNER' | 'SITTER' | 'ADMIN') => {
    const roleLabel: Record<string, string> = { OWNER: 'Hayvan Sahibi', SITTER: 'Bakıcı', ADMIN: 'Yönetici' };
    Alert.alert(
      'Rol Güncelle',
      `"${userName}" kullanıcısına "${roleLabel[newRole]}" rolü atanacak. Devam etmek istiyor musunuz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Onayla',
          onPress: async () => {
            try {
              await adminService.updateUserRole(userId, newRole);
              setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
              );
              Alert.alert('✅ Başarılı', `${userName} kullanıcısının rolü "${roleLabel[newRole]}" olarak güncellendi.`);
            } catch (err: any) {
              Alert.alert('Hata', err?.response?.data?.message || 'Rol güncellenemedi.');
            }
          },
        },
      ]
    );
  };

  const roleLabel: Record<string, string> = { OWNER: 'Hayvan Sahibi', SITTER: 'Bakıcı', ADMIN: 'Yönetici' };
  const roleColor: Record<string, string> = { OWNER: Colors.primary, SITTER: Colors.accent, ADMIN: Colors.secondary };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.secondary} />}
    >
      {/* Başlık */}
      <View style={styles.headerRow}>
        <Ionicons name="shield-checkmark" size={28} color={Colors.secondary} />
        <Text style={styles.title}>Admin Paneli</Text>
      </View>

      {error !== '' && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* İstatistikler */}
      <View style={styles.statsRow}>
        <StatCard label="Kullanıcı" count={users.length} icon="people-outline" />
        <StatCard label="Bakıcı" count={sitters.length} icon="person-outline" />
        <StatCard label="Yorum" count={reviews.length} icon="chatbubble-outline" />
      </View>

      {/* ─── YORUMLAR ─── */}
      <SectionHeader title="Yorumlar" icon="chatbubble-ellipses-outline" />
      {reviews.length === 0 ? (
        <EmptyState message="Silinecek yorum bulunamadı" />
      ) : (
        reviews.map((review) => {
          const preview = review.comment
            ? review.comment.slice(0, 40) + (review.comment.length > 40 ? '...' : '')
            : 'Yorum yok';
          return (
            <View key={review.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <View style={styles.starRow}>
                  <Text style={styles.starText}>{'★'.repeat(review.rating || 0)}{'☆'.repeat(5 - (review.rating || 0))}</Text>
                  <Text style={styles.itemMeta}>  {review.rating}/5</Text>
                </View>
                <Text style={styles.itemTitle} numberOfLines={2}>{preview}</Text>
                {review.reviewerName && (
                  <Text style={styles.itemMeta}>👤 {review.reviewerName}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteReview(review.id, preview)}
              >
                <Ionicons name="trash-outline" size={16} color="#fff" />
                <Text style={styles.deleteBtnText}>Sil</Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}

      {/* ─── BAKICILAR ─── */}
      <SectionHeader title="Bakıcılar" icon="person-circle-outline" />
      {sitters.length === 0 ? (
        <EmptyState message="Silinecek bakıcı bulunamadı" />
      ) : (
        sitters.map((sitter) => (
          <View key={sitter.id} style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{sitter.fullName ?? 'İsimsiz'}</Text>
              <Text style={styles.itemMeta}>📍 {sitter.location ?? 'Konum yok'}</Text>
              {sitter.hourlyRate && (
                <Text style={styles.itemMeta}>💰 ₺{sitter.hourlyRate}/saat</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeleteSitter(sitter.id, sitter.fullName ?? 'İsimsiz')}
            >
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <Text style={styles.deleteBtnText}>Sil</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* ─── KULLANICI YÖNETİMİ ─── */}
      <SectionHeader title="Kullanıcılar" icon="people-outline" />
      {users.length === 0 ? (
        <EmptyState message="Kullanıcı bulunamadı" />
      ) : (
        users.map((u) => (
          <View key={u.id} style={styles.userCard}>
            {/* Kullanıcı Bilgisi */}
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {(u.fullName || u.email || '?')[0].toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{u.fullName ?? u.email}</Text>
                <Text style={styles.itemMeta}>{u.email}</Text>
                <View style={[styles.rolePill, { borderColor: roleColor[u.role] || Colors.border }]}>
                  <Text style={[styles.rolePillText, { color: roleColor[u.role] || Colors.textMuted }]}>
                    {roleLabel[u.role] || u.role}
                  </Text>
                </View>
              </View>
            </View>
            {/* Rol butonları + Sil */}
            <View style={styles.roleBtnRow}>
              {(['OWNER', 'SITTER', 'ADMIN'] as const)
                .filter((r) => r !== u.role)
                .map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleBtn, { borderColor: roleColor[role] }]}
                    onPress={() => handleRoleChange(u.id, u.fullName ?? u.email, role)}
                  >
                    <Text style={[styles.roleBtnText, { color: roleColor[role] }]}>
                      {roleLabel[role]}
                    </Text>
                  </TouchableOpacity>
                ))}
              <TouchableOpacity
                style={styles.deleteUserBtn}
                onPress={() => handleDeleteUser(u.id, u.fullName ?? u.email)}
              >
                <Ionicons name="trash-outline" size={13} color="#fff" />
                <Text style={styles.deleteUserBtnText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

// ── Alt bileşenler ──
function SectionHeader({ title, icon }: { title: string; icon: any }) {
  return (
    <View style={secStyles.wrap}>
      <Ionicons name={icon} size={16} color={Colors.primary} />
      <Text style={secStyles.title}>{title}</Text>
    </View>
  );
}

function StatCard({ label, count, icon }: { label: string; count: number; icon: any }) {
  return (
    <View style={statStyles.card}>
      <Ionicons name={icon} size={20} color={Colors.secondary} />
      <Text style={statStyles.count}>{count}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={{ padding: Spacing.md, alignItems: 'center', marginBottom: Spacing.sm }}>
      <Text style={{ color: Colors.textMuted, fontSize: Typography.fontSize.sm }}>{message}</Text>
    </View>
  );
}

// ── Stiller ──
const secStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: Spacing.xl, marginBottom: Spacing.sm, gap: Spacing.xs,
  },
  title: {
    color: Colors.textSecondary, fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: 0.8,
  },
});

const statStyles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.cardBorder, ...Shadows.sm,
  },
  count: {
    color: Colors.textPrimary, fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.extrabold, marginTop: Spacing.xs,
  },
  label: { color: Colors.textMuted, fontSize: Typography.fontSize.xs },
});

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.sm, marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.textPrimary, fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.extrabold,
  },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: '#FEF2F2', borderRadius: BorderRadius.md,
    padding: Spacing.sm, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { color: Colors.error, fontSize: Typography.fontSize.sm },

  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },

  // Yorum / Bakıcı satırı
  itemCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.cardBorder, ...Shadows.sm,
  },
  itemInfo: { flex: 1, marginRight: Spacing.sm },
  itemTitle: {
    color: Colors.textPrimary, fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold, marginBottom: 2,
  },
  itemMeta: { color: Colors.textMuted, fontSize: Typography.fontSize.xs, marginTop: 2 },
  starRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  starText: { color: '#F59E0B', fontSize: Typography.fontSize.sm },

  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.error, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs,
  },
  deleteBtnText: {
    color: '#fff', fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.bold,
  },

  // Kullanıcı / Rol kartı
  userCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.cardBorder, ...Shadows.sm,
  },
  userInfo: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm },
  userAvatar: {
    width: 40, height: 40, borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  userAvatarText: { color: '#fff', fontWeight: Typography.fontWeight.bold },
  rolePill: {
    alignSelf: 'flex-start', marginTop: 4,
    borderWidth: 1, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 2,
  },
  rolePillText: { fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.semibold },
  roleBtnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  roleBtn: {
    borderWidth: 1, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
  },
  roleBtnText: { fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.semibold },
  deleteUserBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.error, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
  },
  deleteUserBtnText: {
    color: '#fff', fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.bold,
  },

  // Access denied
  denied: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center', padding: Spacing.xl,
  },
  deniedTitle: {
    color: Colors.textPrimary, fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold, marginTop: Spacing.md,
  },
  deniedSubtitle: { color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm },
  backBtn: {
    marginTop: Spacing.lg, backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  backBtnText: { color: '#fff', fontWeight: Typography.fontWeight.bold },
  centered: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: Colors.textMuted, marginTop: Spacing.md },
});
