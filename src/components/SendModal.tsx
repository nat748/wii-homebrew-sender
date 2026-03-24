import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { OSCApp } from '../types/osc';
import { getZipUrl } from '../services/oscApi';
import { sendToWii, validateIp, TransferProgress } from '../services/wiiload';
import { getWiiIp, setWiiIp } from '../services/storage';

interface Props {
  app: OSCApp | null;
  visible: boolean;
  onClose: () => void;
}

export function SendModal({ app, visible, onClose }: Props) {
  const [ip, setIp] = useState('');
  const [progress, setProgress] = useState<TransferProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      getWiiIp().then((savedIp) => {
        if (savedIp) setIp(savedIp);
      });
      setProgress(null);
      setError(null);
    }
  }, [visible]);

  const handleSend = async () => {
    if (!app) return;
    if (!validateIp(ip)) {
      setError('Invalid IP address');
      return;
    }

    setError(null);
    await setWiiIp(ip);

    try {
      await sendToWii(getZipUrl(app.slug), app.slug, ip, setProgress);
    } catch (err: any) {
      setError(err.message);
      setProgress({ stage: 'error', percent: 0, message: err.message });
    }
  };

  const isSending = progress !== null && progress.stage !== 'done' && progress.stage !== 'error';
  const isDone = progress?.stage === 'done';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Send to Wii</Text>
          {app && (
            <Text style={styles.appName}>{app.name}</Text>
          )}

          <Text style={styles.label}>Wii IP Address</Text>
          <Text style={styles.hint}>Found on the Homebrew Channel screen</Text>
          <TextInput
            style={styles.input}
            value={ip}
            onChangeText={setIp}
            placeholder="192.168.1.100"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            editable={!isSending}
            autoCorrect={false}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          {progress && !error && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress.percent}%`,
                      backgroundColor: isDone ? colors.accent : colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, isDone && { color: colors.accent }]}>
                {progress.message}
              </Text>
            </View>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={isSending}
            >
              <Text style={styles.cancelText}>{isDone ? 'Close' : 'Cancel'}</Text>
            </TouchableOpacity>

            {!isDone && (
              <TouchableOpacity
                style={[styles.sendBtn, isSending && styles.sendBtnDisabled]}
                onPress={handleSend}
                disabled={isSending}
              >
                {isSending ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.sendText}>Send</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  appName: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 8,
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
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 8,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.bg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    gap: 12,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  sendBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
    minWidth: 80,
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.primaryDim,
    opacity: 0.7,
  },
  sendText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
