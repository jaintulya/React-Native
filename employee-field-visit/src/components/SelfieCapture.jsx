import React, { useRef } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS } from '../constants/colors';
import PrimaryButton from './PrimaryButton';

export default function SelfieCapture({ uri, onCapture }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [visible, setVisible] = React.useState(false);

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera permission needed', 'Allow camera access to capture your attendance selfie.');
        return;
      }
    }
    setVisible(true);
  };

  const capture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
    if (photo?.uri) {
      onCapture(photo.uri);
      setVisible(false);
    }
  };

  return (
    <View>
      {uri ? <Image source={{ uri }} style={styles.preview} /> : <View style={styles.empty}><Text style={styles.emptyText}>No selfie captured</Text></View>}
      <PrimaryButton title={uri ? 'Retake Selfie' : 'Capture Selfie'} onPress={openCamera} />
      <Modal animationType="slide" visible={visible} onRequestClose={() => setVisible(false)}>
        <View style={styles.cameraScreen}>
          <CameraView ref={cameraRef} style={styles.camera} facing="front" />
          <View style={styles.cameraControls}>
            <Pressable onPress={() => setVisible(false)}><Text style={styles.cancel}>Cancel</Text></Pressable>
            <Pressable style={styles.shutter} onPress={capture}><View style={styles.shutterInner} /></Pressable>
            <View style={styles.placeholder} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { width: '100%', height: 240, borderRadius: 14, marginBottom: 12 },
  empty: { alignItems: 'center', backgroundColor: '#E8EEF9', borderColor: COLORS.border, borderRadius: 14, borderStyle: 'dashed', borderWidth: 1, height: 150, justifyContent: 'center', marginBottom: 12 },
  emptyText: { color: COLORS.muted },
  cameraScreen: { backgroundColor: '#000000', flex: 1 },
  camera: { flex: 1 },
  cameraControls: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 28 },
  cancel: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  shutter: { alignItems: 'center', borderColor: '#FFFFFF', borderRadius: 35, borderWidth: 4, height: 70, justifyContent: 'center', width: 70 },
  shutterInner: { backgroundColor: '#FFFFFF', borderRadius: 27, height: 54, width: 54 },
  placeholder: { width: 50 },
});
