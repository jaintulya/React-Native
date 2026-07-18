import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LocationMap() {
  return <View style={styles.map}><Text style={styles.text}>Map is available in the mobile app.</Text></View>;
}

const styles = StyleSheet.create({
  map: { alignItems: 'center', backgroundColor: '#E8EEF9', borderRadius: 14, height: 220, justifyContent: 'center' },
  text: { color: '#64748B' },
});
