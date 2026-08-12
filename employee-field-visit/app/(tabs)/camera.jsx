import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../src/constants/colors";

export default function CameraScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Camera</Text>
        <Text style={styles.subtitle}>Camera feature coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.background, flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { color: COLORS.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: COLORS.muted, fontSize: 15, marginTop: 8 },
});
