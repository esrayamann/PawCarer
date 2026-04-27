import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { StarRow } from './ui/StarRating';
import type { SitterResponse } from '../services/sitterService';

const PET_ICON: Record<string, string> = {
  Kedi: '🐱', Köpek: '🐶', Kuş: '🦜', Tavşan: '🐰', Balık: '🐟', Diğer: '🐾',
};

interface SitterCardProps {
  sitter: SitterResponse;
}

export function SitterCard({ sitter }: SitterCardProps) {
  const initials = sitter.fullName
    ? sitter.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/sitters/${sitter.id}`)}
      activeOpacity={0.85}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{sitter.fullName}</Text>

          {sitter.location && (
            <View style={styles.row}>
              <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
              <Text style={styles.location}>{sitter.location}</Text>
            </View>
          )}

          <StarRow rating={sitter.averageRating ?? 0} size={13} showLabel />

          {sitter.totalReviews !== undefined && (
            <Text style={styles.reviewCount}>{sitter.totalReviews} yorum</Text>
          )}
        </View>

        {/* Fiyat */}
        {sitter.hourlyRate && (
          <View style={styles.rate}>
            <Text style={styles.rateText}>₺{sitter.hourlyRate}</Text>
            <Text style={styles.rateUnit}>/saat</Text>
          </View>
        )}
      </View>

      {/* Bio */}
      {sitter.bio && (
        <Text style={styles.bio} numberOfLines={2}>
          {sitter.bio}
        </Text>
      )}

      {/* Hayvan türleri */}
      {sitter.acceptedPetTypes && sitter.acceptedPetTypes.length > 0 && (
        <View style={styles.tags}>
          {sitter.acceptedPetTypes.map((type) => (
            <View key={type} style={styles.tag}>
              <Text style={styles.tagText}>{PET_ICON[type] || '🐾'} {type}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Detay linki */}
      <View style={styles.detailRow}>
        <Text style={styles.detailLink}>Profili Görüntüle</Text>
        <Ionicons name="chevron-forward" size={14} color={Colors.secondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Colors.textOnPrimary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.extrabold,
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  location: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.xs,
    marginLeft: 3,
  },
  reviewCount: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.xs,
    marginTop: 2,
  },
  rate: {
    alignItems: 'flex-end',
    backgroundColor: Colors.surfaceHigh,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(244,123,32,0.2)',
  },
  rateText: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
  rateUnit: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.xs,
  },
  bio: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(244,123,32,0.2)',
  },
  tagText: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  detailLink: {
    color: Colors.secondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    marginRight: 2,
  },
});
