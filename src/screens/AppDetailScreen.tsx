import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { OSCApp } from '../types/osc';
import { getIconUrl, formatFileSize, formatDate } from '../services/oscApi';
import { SendModal } from '../components/SendModal';

type RouteParams = {
  AppDetail: { app: OSCApp };
};

export function AppDetailScreen() {
  const { params } = useRoute<RouteProp<RouteParams, 'AppDetail'>>();
  const { app } = params;
  const [sendVisible, setSendVisible] = useState(false);
  const categoryColor = colors.category[app.category] || colors.primary;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: getIconUrl(app.slug) }}
            style={styles.icon}
            defaultSource={require('../../assets/icon.png')}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{app.name}</Text>
            <Text style={styles.author}>by {app.author}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {app.category}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{app.version}</Text>
            <Text style={styles.statLabel}>Version</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {formatFileSize(app.file_size?.zip_compressed || 0)}
            </Text>
            <Text style={styles.statLabel}>Size</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDate(app.release_date)}</Text>
            <Text style={styles.statLabel}>Released</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {app.description?.long || app.description?.short || 'No description available.'}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          {app.peripherals?.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Controllers</Text>
              <Text style={styles.detailValue}>{app.peripherals.join(', ')}</Text>
            </View>
          )}
          {app.supported_platforms?.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Platforms</Text>
              <Text style={styles.detailValue}>{app.supported_platforms.join(', ')}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Package</Text>
            <Text style={styles.detailValue}>{app.package_type?.toUpperCase() || 'DOL'}</Text>
          </View>
          {app.flags?.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Flags</Text>
              <Text style={[styles.detailValue, { color: colors.warning }]}>
                {app.flags.join(', ')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Send button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => setSendVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.sendBtnText}>Send to Wii</Text>
        </TouchableOpacity>
      </View>

      <SendModal
        app={app}
        visible={sendVisible}
        onClose={() => setSendVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  author: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  detailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  sendBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
