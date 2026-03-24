import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { getWiiIp, setWiiIp } from '../services/storage';
import { validateIp } from '../services/wiiload';

export function SettingsScreen() {
  const [ip, setIp] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getWiiIp().then((savedIp) => {
      if (savedIp) setIp(savedIp);
    });
  }, []);

  const handleSave = async () => {
    if (ip.trim() && !validateIp(ip.trim())) {
      Alert.alert('Invalid IP', 'Please enter a valid IPv4 address (e.g., 192.168.1.100)');
      return;
    }
    await setWiiIp(ip.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Wii Connection</Text>
        <Text style={styles.description}>
          Enter your Wii's IP address. You can find it displayed on the Homebrew Channel main screen.
        </Text>

        <Text style={styles.label}>IP Address</Text>
        <TextInput
          style={styles.input}
          value={ip}
          onChangeText={(text) => {
            setIp(text);
            setSaved(false);
          }}
          placeholder="192.168.1.100"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.savedBtn]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>{saved ? 'Saved!' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>About</Text>
        <Text style={styles.description}>
          Wii Homebrew Sender lets you browse the Open Shop Channel catalog and send homebrew apps directly to your Wii over your local network using the WiiLoad protocol.
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Protocol</Text>
          <Text style={styles.infoValue}>WiiLoad v0.5 (TCP:4299)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Source</Text>
          <Text style={styles.infoValue}>Open Shop Channel API v3</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  savedBtn: {
    backgroundColor: colors.accent,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  infoValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
});
