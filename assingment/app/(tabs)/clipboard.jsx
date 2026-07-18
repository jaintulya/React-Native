import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";

const ClipboardDemo = () => {
  const [textToCopy, setTextToCopy] = useState("");
  const [copiedText, setCopiedText] = useState(null);

  // Copy Text
  const handleTextToCopy = async () => {
    if (textToCopy.trim() === "") {
      Alert.alert("Error", "Please enter some text.");
      return;
    }

    await Clipboard.setStringAsync(textToCopy);
    Alert.alert("Success", "Text copied to clipboard.");
  };

  // Paste Text
  const handlePasteText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text.trim() ? text : "Nothing to paste");
  };


  const handleClearClipboard = async () => {
    await Clipboard.setStringAsync("");
    setCopiedText(null);
    setTextToCopy("");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clipboard Demo</Text>

      <TextInput
        style={styles.input}
        placeholder="Type something to copy..."
        value={textToCopy}
        onChangeText={setTextToCopy}
      />

      <Pressable style={styles.button} onPress={handleTextToCopy}>
        <Text style={styles.buttonText}>Copy Text</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handlePasteText}>
        <Text style={styles.buttonText}>Paste From Clipboard</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.clearButton]} onPress={handleClearClipboard}>
        <Text style={styles.buttonText}>Clear Clipboard</Text>
      </Pressable>

      <Text style={styles.result}>Copied Text:</Text>
      <Text style={styles.output}>{copiedText ?? "null"}</Text>
    </View>
  );
};

export default ClipboardDemo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

  button: {
    width: "90%",
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  clearButton: {
    backgroundColor: "#DC2626",
  },

  result: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "bold",
  },

  output: {
    marginTop: 10,
    fontSize: 18,
    color: "green",
  },
});




