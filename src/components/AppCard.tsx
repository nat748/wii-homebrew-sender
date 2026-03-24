import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { OSCApp } from '../types/osc';
import { getIconUrl, formatFileSize } from '../services/oscApi';

interface Props {
  app: OSCApp;
  onPress: () => void;
}

export function AppCard({ app, onPress }: Props) {
  const categoryColor = colors.category[app.category] || colors.primary;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={{ uri: getIconUrl(app.slug) }}
        style={styles.icon}
        defaultSource={require('../../assets/icon.png')}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {app.name}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {app.author}
        </Text>
        <View style={styles.meta}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {app.category}
            </Text>
          </View>
          <Text style={styles.size}>
            {formatFileSize(app.file_size?.zip_compressed || 0)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  author: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  size: {
    color: colors.textMuted,
    fontSize: 11,
    marginLeft: 8,
  },
});
