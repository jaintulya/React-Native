import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LocationMap({ style }) {
  return (
    <View style={[style, styles.placeholder]}>
      <Text style={styles.text}>Map preview is available in the mobile app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#dbeafe', padding: 24 },
  text: { color: '#1e3a8a', textAlign: 'center' },
});
