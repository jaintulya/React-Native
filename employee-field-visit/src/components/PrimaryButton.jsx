import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/colors';

export default function PrimaryButton({ title, onPress, disabled = false, tone = 'primary' }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, tone === 'outline' && styles.outline, disabled && styles.disabled]}
    >
      <Text style={[styles.label, tone === 'outline' && styles.outlineLabel]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 12, minHeight: 50, justifyContent: 'center', paddingHorizontal: 16 },
  label: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  outline: { backgroundColor: '#FFFFFF', borderColor: COLORS.primary, borderWidth: 1 },
  outlineLabel: { color: COLORS.primary },
  disabled: { opacity: 0.5 },
});
