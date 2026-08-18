import { View, Text, Button, TextInput, Image } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";

export default function Clip() {
  const [text, setText] = useState("");
  const [getText, setGetText] = useState("");
  const [image, setImage] = useState("");

  const handleCopyText = async () => {
    await Clipboard.setStringAsync(text);
    setText("");
    setGetText("");
  };

  const handleGetCopiedText = async () => {
    const res = await Clipboard.getStringAsync();
    setGetText(res);
  }

  // const handleCopyURL = async () => {
  //   const urlLink =  "https://github.com/Sushant-Ravi14/CGxSU_Semester_1/blob/main/Semester_3/react-native/Unit%204_Native%20Features/4.Clipboard/1.expo-clipboard.md";
  //   await Clipboard.setStringAsync(urlLink)
  // }


    const pasteImage = async () => {
      const hasImage = await Clipboard.hasImageAsync();

      if (!hasImage) {
        return;
      }

      const result = await Clipboard.getImageAsync({
        format: "png",
      });

      setImage(result);
    };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <TextInput
        placeholder="Enter Something..."
        style={{
          width: 400,
          height: 35,
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 20,
        }}
        value={text}
        onChangeText={setText}
      />

      <Button title="Paste Image" onPress={pasteImage} />
      <View style={{ height: 20 }} />
      <Button title="Copy Text" onPress={handleCopyText} />
      <View style={{ height: 20 }} />
      <Button title="Get Copied Text" onPress={handleGetCopiedText} />
      <Text>{getText}</Text>

      {image ? (
        <View
          style={{
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: image.data,
            }}
            style={{
              width: 250,
              height: 250,
            }}
          />

          <Text
            style={{
              marginTop: 10,
            }}
          >
            {image.size.width} × {image.size.height}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            marginTop: 20,
          }}
        >
          No image pasted
        </Text>
      )}
    </View>
  );
}