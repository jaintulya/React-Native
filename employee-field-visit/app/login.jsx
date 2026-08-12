import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { setItem } from "../utils/storage";
import { COLORS } from "../src/constants/colors";
import PrimaryButton from "../src/components/PrimaryButton";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Missing details", "Enter both username and password.");
      return;
    }
    await setItem("token", "loggedIn");
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>EMPLOYEE PORTAL</Text>
        <Text style={styles.title}>Field Visit</Text>
        <Text style={styles.subtitle}>
          Sign in to mark your attendance from the field.
        </Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          autoCapitalize="words"
          placeholder="Username / Employee name"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          style={styles.input}
        />
        <PrimaryButton title="Login" onPress={login} />
        <Text style={styles.help}>
          Demo login: any non-empty username and password.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEF4FF",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    elevation: 2,
    padding: 24,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  eyebrow: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: { color: COLORS.text, fontSize: 32, fontWeight: "800", marginTop: 6 },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 8,
  },
  input: {
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 14,
    padding: 14,
  },
  help: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 16,
    textAlign: "center",
  },
});
