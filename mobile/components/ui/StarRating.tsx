import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

interface StarRowProps {
  rating: number;
  onRate?: (r: number) => void;
  size?: number;
  showLabel?: boolean;
}

export function StarRow({ rating, onRate, size = 24, showLabel = false }: StarRowProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRate?.(star)}
          activeOpacity={onRate ? 0.7 : 1}
          disabled={!onRate}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? Colors.warning : Colors.textMuted}
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
      {showLabel && (
        <Text style={styles.label}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 3,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
});
