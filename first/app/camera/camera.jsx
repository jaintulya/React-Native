import React, { useRef, useState } from "react";
import { View, Button, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          title="Grant Camera Permission"
          onPress={requestPermission}
        />
      </View>
    );
  }

  const takePicture = async () => {
    const result = await cameraRef.current.takePictureAsync();

    console.log(result);
    setPhoto(result.uri);
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
      />

      <Button
        title="Take Picture"
        onPress={takePicture}
      />

      {photo && (
        <Image
          source={{ uri: photo }}
          style={{
            width: 200,
            height: 200,
            alignSelf: "center",
            marginTop: 20,
          }}
        />
      )}
    </View>
  );
}