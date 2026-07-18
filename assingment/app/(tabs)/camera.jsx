import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { documentDirectory, makeDirectoryAsync, moveAsync } from 'expo-file-system';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ACCENT = '#7C3AED';
const PHOTOS_DIR = documentDirectory + 'CameraGallery/';

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  const takePhoto = async () => {
    if (busy || !cameraRef.current || !ready) {
      Alert.alert('Camera not ready', 'Please wait for the camera to load.');
      return;
    }

    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      await makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
      const filename = `photo_${Date.now()}.jpg`;
      await moveAsync({
        from: photo.uri,
        to: PHOTOS_DIR + filename,
      });
      Alert.alert('Saved', 'Photo saved to gallery.');
      router.replace('/(tabs)/gallery');
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  if (!permission) return <View style={styles.permissionScreen} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}>
            <Feather name="camera" color={ACCENT} size={34} />
          </View>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionCopy}>
            Allow access to take photos and save them.
          </Text>
          <Pressable style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Enable camera</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.cameraScreen}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
        onCameraReady={() => setReady(true)}
      />
      <SafeAreaView style={styles.cameraOverlay}>
        <View style={styles.topControls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Toggle flash"
            onPress={() => setFlash((p) => (p === 'off' ? 'on' : 'off'))}
            style={styles.roundButton}
          >
            <Feather name={flash === 'off' ? 'zap-off' : 'zap'} size={22} color="#fff" />
          </Pressable>
          <Text style={styles.cameraTitle}>CAMERA</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Flip camera"
            onPress={() => setFacing((p) => (p === 'back' ? 'front' : 'back'))}
            style={styles.roundButton}
          >
            <Feather name="refresh-cw" size={21} color="#fff" />
          </Pressable>
        </View>
        <View style={styles.bottomControls}>
          <Pressable
            style={styles.galleryShortcut}
            onPress={() => router.push('/(tabs)/gallery')}
          >
            <Feather name="image" size={23} color="#fff" />
            <Text style={styles.shortcutText}>Gallery</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Take photo"
            disabled={busy}
            onPress={takePhoto}
            style={styles.shutterOuter}
          >
            <View style={styles.shutterInner}>
              {busy ? <ActivityIndicator color={ACCENT} /> : null}
            </View>
          </Pressable>
          <View style={styles.galleryShortcut} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraScreen: { flex: 1, backgroundColor: '#111' },
  cameraOverlay: { flex: 1, justifyContent: 'space-between', padding: 18 },
  topControls: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  cameraTitle: { color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  roundButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.36)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  bottomControls: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 18,
  },
  galleryShortcut: { alignItems: 'center', justifyContent: 'center', width: 64 },
  shortcutText: { color: '#fff', fontSize: 11, fontWeight: '700', marginTop: 4 },
  shutterOuter: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: 'rgba(255,255,255,0.55)',
    borderRadius: 40,
    borderWidth: 5,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  shutterInner: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  permissionScreen: {
    alignItems: 'center',
    backgroundColor: '#F7F5FF',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  permissionCard: { alignItems: 'center', maxWidth: 340 },
  permissionIcon: {
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginBottom: 22,
    width: 60,
  },
  permissionTitle: { color: '#1F1934', fontSize: 23, fontWeight: '800' },
  permissionCopy: {
    color: '#6B6580',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    marginTop: 28,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
