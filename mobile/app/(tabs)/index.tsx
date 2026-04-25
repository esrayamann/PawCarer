import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sitterService, SitterResponse } from '../../services/sitterService';
import { SitterCard } from '../../components/SitterCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

const PET_TYPES = ['Tümü', 'Kedi', 'Köpek', 'Kuş', 'Tavşan', 'Hamster'];

export default function SearchScreen() {
  const [location, setLocation] = useState('');
  const [petType, setPetType] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [sitters, setSitters] = useState<SitterResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const results = await sitterService.searchSitters({
        location: location.trim() || undefined,
        petType: petType && petType !== 'Tümü' ? petType : undefined,
        petBreed: petBreed.trim() || undefined,
      });
      setSitters(results);
      setSearched(true);
    } catch {
      setError('Arama sırasında bir hata oluştu. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [location, petType, petBreed]);

  // İlk render'da tüm bakıcıları yükle
  React.useEffect(() => {
    handleSearch();
  }, []);

  return (
    <View style={styles.container}>
      {/* Arama Filtreleri */}
      <View style={styles.filterPanel}>
        <Input
          placeholder="Konum ara... (Örn: İstanbul)"
          value={location}
          onChangeText={setLocation}
          leftIcon="location-outline"
          containerStyle={styles.locationInput}
        />

        {/* Hayvan Türü Seçimi */}
        <Text style={styles.filterLabel}>Hayvan Türü</Text>
        <View style={styles.chipRow}>
          {PET_TYPES.map((type) => {
            const active = type === 'Tümü' ? !petType || petType === '' : petType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setPetType(type === 'Tümü' ? '' : type)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{type}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Input
          placeholder="Cins filtrele... (Örn: Siyam)"
          value={petBreed}
          onChangeText={setPetBreed}
          leftIcon="filter-outline"
          containerStyle={styles.breedInput}
        />

        <Button title="Ara" onPress={handleSearch} loading={loading} size="md" />
      </View>

      {/* Sonuçlar */}
      {error !== '' ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Tekrar Dene" onPress={handleSearch} variant="ghost" size="sm" style={{ marginTop: Spacing.md }} />
        </View>
      ) : loading && !searched ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loadingText}>Bakıcılar yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={sitters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SitterCard sitter={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleSearch}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            searched ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={60} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>Bakıcı Bulunamadı</Text>
                <Text style={styles.emptySubtitle}>
                  Farklı filtreler deneyerek arama yapabilirsiniz.
                </Text>
              </View>
            ) : null
          }
          ListHeaderComponent={
            sitters.length > 0 ? (
              <View style={styles.resultHeader}>
                <Text style={styles.resultCount}>{sitters.length} bakıcı bulundu</Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Hayvan Ekle FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/pets/new')}>
        <Ionicons name="paw" size={22} color={Colors.textOnPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterPanel: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationInput: { marginBottom: Spacing.sm },
  breedInput: { marginTop: Spacing.sm, marginBottom: Spacing.sm },
  filterLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceHigh,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextActive: {
    color: Colors.textOnPrimary,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: 80,
  },
  resultHeader: {
    marginBottom: Spacing.sm,
  },
  resultCount: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.sm,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    color: Colors.textMuted,
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
  },
  errorText: {
    color: Colors.error,
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
