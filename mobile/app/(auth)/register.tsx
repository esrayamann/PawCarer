import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  general?: string;
}

export default function RegisterScreen() {
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'OWNER' | 'SITTER'>('OWNER');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Ad Soyad zorunludur';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }
    if (password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Şifre büyük/küçük harf ve rakam içermelidir';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authService.register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        role,
        location: location.trim() || undefined,
      });
      await login(response.token, response.user);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 409) {
        setErrors({ email: 'Bu email adresi zaten kullanılıyor' });
      } else if (status === 400) {
        setErrors({ general: 'Geçersiz bilgiler. Lütfen kontrol ediniz.' });
      } else {
        setErrors({ general: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    fullName.trim() && email.trim() && password && confirmPassword;

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
        {/* Logo / Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="paw" size={36} color={Colors.primary} />
          </View>
          <Text style={styles.title}>PawCarer'a Hoş Geldin</Text>
          <Text style={styles.subtitle}>Hesap oluşturarak başla</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {errors.general && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          )}

          <Input
            label="Ad Soyad"
            placeholder="Adınızı ve soyadınızı girin"
            value={fullName}
            onChangeText={(t) => { setFullName(t); setErrors((e) => ({ ...e, fullName: undefined })); }}
            error={errors.fullName}
            leftIcon="person-outline"
            autoCapitalize="words"
          />

          <Input
            label="Email"
            placeholder="ornek@email.com"
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
            error={errors.email}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Şifre"
            placeholder="En az 8 karakter"
            value={password}
            onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
            error={errors.password}
            leftIcon="lock-closed-outline"
            isPassword
          />

          <Input
            label="Şifre Tekrar"
            placeholder="Şifrenizi tekrar girin"
            value={confirmPassword}
            onChangeText={(t) => { setConfirmPassword(t); setErrors((e) => ({ ...e, confirmPassword: undefined })); }}
            error={errors.confirmPassword}
            leftIcon="lock-closed-outline"
            isPassword
          />

          <Input
            label="Konum (Opsiyonel)"
            placeholder="Örn: Kadıköy, İstanbul"
            value={location}
            onChangeText={setLocation}
            leftIcon="location-outline"
          />

          {/* Rol Seçimi */}
          <Text style={styles.roleLabel}>Hesap Türü</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'OWNER' && styles.roleBtnActive]}
              onPress={() => setRole('OWNER')}
            >
              <Ionicons
                name="heart-outline"
                size={18}
                color={role === 'OWNER' ? Colors.textOnPrimary : Colors.textMuted}
              />
              <Text style={[styles.roleBtnText, role === 'OWNER' && styles.roleBtnTextActive]}>
                Hayvan Sahibi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'SITTER' && styles.roleBtnActive]}
              onPress={() => setRole('SITTER')}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={role === 'SITTER' ? Colors.textOnPrimary : Colors.textMuted}
              />
              <Text style={[styles.roleBtnText, role === 'SITTER' && styles.roleBtnTextActive]}>
                Bakıcı
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Kayıt Ol"
            onPress={handleRegister}
            loading={loading}
            disabled={!isFormValid}
            size="lg"
            style={styles.submitBtn}
          />
        </View>

        {/* Alt link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.footerLink}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
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
  form: {
    marginTop: Spacing.sm,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,82,82,0.1)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  errorBannerText: {
    color: Colors.error,
    fontSize: Typography.fontSize.sm,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  roleLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  roleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleBtnText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  roleBtnTextActive: {
    color: Colors.textOnPrimary,
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.base,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});
