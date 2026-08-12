import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef, useState } from "react";

export default function GalleryScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const [locationPermission, setLocationPermission] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [journal, setJournal] = useState([]);

  const [renameIndex, setRenameIndex] = useState(null);
  const [newName, setNewName] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const cameraRef = useRef(null);

  const getLocationPermission = async () => {
    const result = await Location.requestForegroundPermissionsAsync();

    if (result.granted) {
      setLocationPermission(true);
    } else {
      alert("Location permission denied");
    }
  };

  const loadJournal = async () => {
    try {
      const data = await AsyncStorage.getItem("journal");

      if (data) {
        setJournal(JSON.parse(data));
      }
    } catch (error) {
      alert("Unable to load journal");
    }
  };

  const refreshJournal = async () => {
    setRefreshing(true);

    await loadJournal();

    setRefreshing(false);
  };

  const saveJournal = async (data) => {
    await AsyncStorage.setItem("journal", JSON.stringify(data));

    setJournal(data);
  };

  const capturePhoto = async () => {
    try {
      if (!locationPermission) {
        await getLocationPermission();
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const result = await cameraRef.current.takePictureAsync();

      const latitude = currentLocation.coords.latitude;

      const longitude = currentLocation.coords.longitude;

      const key = `${latitude},${longitude}`;

      let address = await AsyncStorage.getItem(key);

      if (!address) {
        const addressResult = await Location.reverseGeocodeAsync({
          latitude: latitude,
          longitude: longitude,
        });

        if (addressResult.length > 0) {
          const place = addressResult[0];

          address =
            `${place.name || ""} ` +
            `${place.city || ""} ` +
            `${place.region || ""}`;

          await AsyncStorage.setItem(key, address);
        }
      }

      if (!address) {
        address = "Unknown Address";
      }

      const newPhoto = {
        uri: result.uri,
        name: "Travel Photo",
        address: address,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toLocaleString(),
        favorite: false,
      };

      const newJournal = [...journal, newPhoto];

      setPhoto(newPhoto);

      await saveJournal(newJournal);
    } catch (error) {
      alert("Unable to capture photo");
    }
  };

  const deletePhoto = async (index) => {
    const newJournal = journal.filter((_, i) => i !== index);

    await saveJournal(newJournal);

    if (photo === journal[index]) {
      setPhoto(null);
    }
  };

  const startRename = (index) => {
    setRenameIndex(index);
    setNewName(journal[index].name);
  };

  const renamePhoto = async () => {
    if (!newName.trim()) {
      return;
    }

    const newJournal = [...journal];

    newJournal[renameIndex].name = newName;

    await saveJournal(newJournal);

    setRenameIndex(null);
    setNewName("");
  };

  const favoritePhoto = async (index) => {
    const newJournal = [...journal];

    newJournal[index].favorite = !newJournal[index].favorite;

    await saveJournal(newJournal);
  };

  const clearJournal = async () => {
    await AsyncStorage.removeItem("journal");

    setJournal([]);
    setPhoto(null);
  };

  if (!cameraPermission) {
    return <Text>Loading...</Text>;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>

        <Button title="Allow Camera" onPress={requestCameraPermission} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshJournal} />
      }
    >
      <Text style={styles.title}>Travel Gallery</Text>

      <CameraView ref={cameraRef} style={styles.camera} />

      <Button title="Capture Photo" onPress={capturePhoto} />

      <View style={styles.space} />

      <Button title="Load Saved Photos" onPress={loadJournal} />

      <View style={styles.space} />

      <Button title="Clear All Photos" onPress={clearJournal} />

      {photo && (
        <View style={styles.latest}>
          <Text style={styles.heading}>Latest Photo</Text>

          <Image source={{ uri: photo.uri }} style={styles.photo} />

          <Text>{photo.name}</Text>

          <Text>📍 {photo.address}</Text>

          <Text>
            {photo.latitude}, {photo.longitude}
          </Text>

          <Text>{photo.timestamp}</Text>
        </View>
      )}

      <View style={styles.gallery}>
        <Text style={styles.heading}>Image Gallery</Text>

        {journal.length === 0 && <Text>No photos saved</Text>}

        {journal.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={{ uri: item.uri }} style={styles.galleryImage} />

            <Text style={styles.name}>{item.name}</Text>

            <Text>📍 {item.address}</Text>

            <Text>
              {item.latitude}, {item.longitude}
            </Text>

            <Text>{item.timestamp}</Text>

            <Text>{item.favorite ? "❤️ Favorite" : "♡ Not Favorite"}</Text>

            <View style={styles.button}>
              <Button title="Favorite" onPress={() => favoritePhoto(index)} />
            </View>

            <View style={styles.button}>
              <Button title="Rename" onPress={() => startRename(index)} />
            </View>

            <View style={styles.button}>
              <Button title="Delete" onPress={() => deletePhoto(index)} />
            </View>

            {renameIndex === index && (
              <View>
                <TextInput
                  placeholder="New name"
                  value={newName}
                  onChangeText={setNewName}
                  style={styles.input}
                />

                <Button title="Save Name" onPress={renamePhoto} />
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  camera: {
    height: 300,
    marginBottom: 10,
  },

  latest: {
    marginTop: 15,
  },

  photo: {
    width: "100%",
    height: 250,
    marginBottom: 8,
  },

  gallery: {
    marginTop: 20,
  },

  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },

  galleryImage: {
    width: "100%",
    height: 200,
    marginBottom: 8,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },

  button: {
    marginTop: 8,
  },

  space: {
    height: 8,
  },
});
