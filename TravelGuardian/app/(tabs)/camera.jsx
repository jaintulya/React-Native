import { View, Text, Button, Image, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef(null);

  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [torch, setTorch] = useState(false);

  const [photo, setPhoto] = useState(null);

  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState("");
  const [scanType, setScanType] = useState("");

  if (!permission) {
    return <Text>Loading...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>

        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    const result = await cameraRef.current.takePictureAsync();

    setPhoto(result);
  };

  const switchCamera = () => {
    setFacing(facing === "back" ? "front" : "back");
  };

  const changeFlash = () => {
    if (flash === "off") {
      setFlash("auto");
    } else if (flash === "auto") {
      setFlash("on");
    } else {
      setFlash("off");
    }
  };

  const handleScan = ({ data, type }) => {
    if (scanned) {
      return;
    }

    setScanned(true);
    setScanData(data);
    setScanType(type);
  };

  const resetScanner = () => {
    setScanned(false);
    setScanData("");
    setScanType("");
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "code128"],
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />

      <View style={styles.buttons}>
        <Button title="Flip Camera" onPress={switchCamera} />

        <Button title={"Flash: " + flash} onPress={changeFlash} />

        <Button
          title={torch ? "Torch: ON" : "Torch: OFF"}
          onPress={() => setTorch(!torch)}
        />

        <Button title="Take Photo" onPress={takePhoto} />
      </View>

      <Text style={styles.status}>Camera: Ready</Text>

      {photo && (
        <View style={styles.photoBox}>
          <Text>Photo Preview</Text>

          <Image source={{ uri: photo.uri }} style={styles.photo} />

          <Text>URI: {photo.uri}</Text>
        </View>
      )}

      {scanned && (
        <View style={styles.scanBox}>
          <Text>Scan Complete</Text>

          <Text>Type: {scanType}</Text>

          <Text>Data: {scanData}</Text>

          <Button title="Scan Again" onPress={resetScanner} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  buttons: {
    padding: 10,
    gap: 8,
  },

  status: {
    padding: 10,
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  photoBox: {
    padding: 10,
  },

  photo: {
    width: 200,
    height: 200,
    marginTop: 10,
  },

  scanBox: {
    padding: 15,
  },
});
