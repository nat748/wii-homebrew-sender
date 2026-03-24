import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { OSCApp, Category, CATEGORIES } from '../types/osc';
import { fetchApps, clearCache } from '../services/oscApi';
import { AppCard } from '../components/AppCard';
import { CategoryPill } from '../components/CategoryPill';

type RootStackParamList = {
  Main: undefined;
  AppDetail: { app: OSCApp };
};

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [apps, setApps] = useState<OSCApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [error, setError] = useState<string | null>(null);

  const loadApps = useCallback(async (refresh = false) => {
    try {
      setError(null);
      if (refresh) clearCache();
      const data = await fetchApps();
      setApps(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const filtered = useMemo(() => {
    let result = apps;
    if (category !== 'all') {
      result = result.filter((a) => a.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.description?.short?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [apps, category, search]);

  const onRefresh = () => {
    setRefreshing(true);
    loadApps(true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading apps...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load apps</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search apps..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
      </View>

      {/* Category filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat.value}
            label={cat.label}
            active={category === cat.value}
            color={cat.value !== 'all' ? colors.category[cat.value] : undefined}
            onPress={() => setCategory(cat.value)}
          />
        ))}
      </ScrollView>

      {/* Results count */}
      <Text style={styles.resultCount}>
        {filtered.length} app{filtered.length !== 1 ? 's' : ''}
      </Text>

      {/* App list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => (
          <AppCard
            app={item}
            onPress={() => navigation.navigate('AppDetail', { app: item })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
  errorDetail: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categories: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultCount: {
    color: colors.textMuted,
    fontSize: 12,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  list: {
    paddingBottom: 20,
  },
});
