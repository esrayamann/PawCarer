import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { Button } from '../../components/ui/Button';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const fresh = await userService.getUser(user.id);
      updateUser(fresh);
    } catch {
      // Mevcut veriyle devam et
    }
  }, [user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUser();
    setRefreshing(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    setDeleteLoading(true);
    try {
      await userService.deleteUser(user.id);
      await logout();
    } catch (err: any) {
      Alert.alert('Hata', 'Hesap silinemedi. Lütfen tekrar deneyin.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const roleLabel = {
    OWNER: 'Hayvan Sahibi',
    SITTER: 'Bakıcı',
    ADMIN: 'Yönetici',
  }[user?.role ?? 'OWNER'];

  const roleColor = {
    OWNER: Colors.primary,
    SITTER: Colors.success,
    ADMIN: Colors.secondary,
  }[user?.role ?? 'OWNER'];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      {/* Avatar + Temel Bilgi */}
      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.fullName ?? '—'}</Text>
        <View style={[styles.roleBadge, { backgroundColor: roleColor + '22', borderColor: roleColor }]}>
          <Text style={[styles.roleText, { color: roleColor }]}>{roleLabel}</Text>
        </View>
      </View>

      {/* Bilgi Kartları */}
      <View style={styles.infoCard}>
        <InfoRow icon="mail-outline" label="Email" value={user?.email ?? '—'} />
        <Divider />
        <InfoRow icon="location-outline" label="Konum" value={user?.location ?? 'Belirtilmemiş'} />
        <Divider />
        <InfoRow icon="call-outline" label="Telefon" value={user?.phoneNumber ?? 'Belirtilmemiş'} />
      </View>

      {/* Eylemler */}
      <View style={styles.actions}>
        <Button
          title="Profili Düzenle"
          onPress={() => router.push('/profile/edit')}
          variant="primary"
          size="lg"
          style={styles.actionBtn}
        />

        {user?.role === 'OWNER' && (
          <Button
            title="🐾 Hayvan Ekle"
            onPress={() => router.push('/pets/new')}
            variant="ghost"
            size="lg"
            style={styles.actionBtn}
          />
        )}

        {user?.role === 'ADMIN' && (
          <Button
            title="Admin Paneli"
            onPress={() => router.push('/admin')}
            variant="secondary"
            size="lg"
            style={styles.actionBtn}
          />
        )}

        <Button
          title="Çıkış Yap"
          onPress={logout}
          variant="secondary"
          size="lg"
          style={styles.actionBtn}
        />

        <Button
          title="Hesabı Sil"
          onPress={() => setShowDeleteModal(true)}
          variant="danger"
          size="lg"
          style={[styles.actionBtn, styles.dangerBtn]}
        />
      </View>

      {/* Hesap Silme Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrapper}>
              <Ionicons name="warning" size={40} color={Colors.danger} />
            </View>
            <Text style={styles.modalTitle}>Hesabı Sil</Text>
            <Text style={styles.modalBody}>
              Bu işlem <Text style={styles.bold}>geri alınamaz</Text>. Hesabınız ve tüm verileriniz
              kalıcı olarak silinecektir. Devam etmek istiyor musunuz?
            </Text>
            <View style={styles.modalActions}>
              <Button
                title="Vazgeç"
                onPress={() => setShowDeleteModal(false)}
                variant="secondary"
                style={styles.modalBtn}
                disabled={deleteLoading}
              />
              <Button
                title="Evet, Sil"
                onPress={handleDeleteAccount}
                variant="danger"
                style={styles.modalBtn}
                loading={deleteLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Ionicons name={icon} size={18} color={Colors.primary} style={infoStyles.icon} />
      <View style={infoStyles.content}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: Colors.border, marginLeft: 46 }} />;
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  icon: { marginRight: Spacing.md, width: 22 },
  content: { flex: 1 },
  label: { color: Colors.textMuted, fontSize: Typography.fontSize.xs, marginBottom: 2 },
  value: { color: Colors.textPrimary, fontSize: Typography.fontSize.base },
});

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  roleText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  actions: { gap: Spacing.sm },
  actionBtn: {},
  dangerBtn: { marginTop: Spacing.md },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  modalIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,59,48,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  modalBody: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  bold: { color: Colors.danger, fontWeight: Typography.fontWeight.bold },
  modalActions: { flexDirection: 'row', gap: Spacing.sm, width: '100%' },
  modalBtn: { flex: 1 },
});
