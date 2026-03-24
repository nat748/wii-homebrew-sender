import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
}

export function CategoryPill({ label, active, color, onPress }: Props) {
  const activeColor = color || colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.pill,
        active && { backgroundColor: activeColor, borderColor: activeColor },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 8,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  activeText: {
    color: colors.white,
  },
});
