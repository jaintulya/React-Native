import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { documentDirectory, getInfoAsync, readDirectoryAsync } from 'expo-file-system';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

const ACCENT = '#7C3AED';
const PHOTOS_DIR = documentDirectory + 'CameraGallery/';

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const dirInfo = await getInfoAsync(PHOTOS_DIR);
      if (!dirInfo.exists) {
        setPhotos([]);
        return;
      }
      const files = await readDirectoryAsync(PHOTOS_DIR);
      const uris = files
        .filter((f) => f.endsWith('.jpg'))
        .sort()
        .reverse()
        .map((f) => ({ id: f, uri: PHOTOS_DIR + f }));
      setPhotos(uris);
    } catch (err) {
      console.warn('Failed to load photos:', err.message);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, [loadPhotos])
  );

  return (
    <SafeAreaView style={styles.galleryScreen}>
      <View style={styles.galleryHeader}>
        <View>
          <Text style={styles.galleryTitle}>My Gallery</Text>
          <Text style={styles.gallerySubtitle}>
            {photos.length} photo{photos.length === 1 ? '' : 's'}
          </Text>
        </View>
        <Pressable onPress={loadPhotos} style={styles.refreshButton}>
          <Feather name="refresh-cw" color={ACCENT} size={20} />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={ACCENT} style={styles.loader} size="large" />
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={
            photos.length ? styles.photoGrid : styles.emptyList
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="camera" size={42} color="#A78BFA" />
              <Text style={styles.emptyTitle}>No photos yet</Text>
              <Text style={styles.emptyCopy}>
                Take your first photo from the Camera tab.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedPhoto(item.uri)}
              style={styles.photoCell}
            >
              <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            </Pressable>
          )}
        />
      )}

      <Modal
        visible={Boolean(selectedPhoto)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modal}>
          <Pressable
            style={styles.closePreview}
            onPress={() => setSelectedPhoto(null)}
          >
            <Feather name="x" size={25} color="#fff" />
          </Pressable>
          {selectedPhoto && (
            <Image
              source={{ uri: selectedPhoto }}
              resizeMode="contain"
              style={styles.preview}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  galleryScreen: { backgroundColor: '#fff', flex: 1 },
  galleryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  galleryTitle: { color: '#201A32', fontSize: 25, fontWeight: '800' },
  gallerySubtitle: { color: '#7B748B', fontSize: 13, marginTop: 3 },
  refreshButton: { backgroundColor: '#F1EDFF', borderRadius: 20, padding: 10 },
  loader: { marginTop: 70 },
  photoGrid: { padding: 2 },
  photoCell: { height: 132, padding: 2, width: '33.333%' },
  thumbnail: { backgroundColor: '#EEE', height: '100%', width: '100%' },
  emptyList: { flexGrow: 1 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
    paddingTop: 100,
  },
  emptyTitle: { color: '#2A243A', fontSize: 20, fontWeight: '800', marginTop: 16 },
  emptyCopy: {
    color: '#756E82',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  modal: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.96)',
    flex: 1,
    justifyContent: 'center',
  },
  preview: { height: '100%', width: '100%' },
  closePreview: { position: 'absolute', right: 22, top: 54, zIndex: 2 },
});
