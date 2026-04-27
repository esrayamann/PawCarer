import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, BorderRadius, Typography, Spacing } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' ? Colors.primary : Colors.textOnPrimary}
          size="small"
        />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  size_sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    minHeight: 36,
  },
  size_md: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    minHeight: 48,
  },
  size_lg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },
  text: {
    fontWeight: Typography.fontWeight.semibold,
  },
  text_primary: { color: Colors.textOnPrimary },
  text_secondary: { color: Colors.textPrimary },
  text_danger: { color: Colors.textOnPrimary },
  text_ghost: { color: Colors.primary },
  textSize_sm: { fontSize: Typography.fontSize.sm },
  textSize_md: { fontSize: Typography.fontSize.base },
  textSize_lg: { fontSize: Typography.fontSize.md },
});
