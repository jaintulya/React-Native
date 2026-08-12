import { View, Text, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { useState } from "react";

export default function LocationScreen() {
  const [permission, setPermission] = useState(false);
  const [location, setLocation] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);

  const requestPermission = async () => {
    const result = await Location.requestForegroundPermissionsAsync();

    if (result.granted) {
      setPermission(true);
    } else {
      alert("Location permission denied");
    }
  };

  const getCurrentLocation = async () => {
    try {
      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(result);
    } catch (error) {
      alert("Unable to get current location");
    }
  };

  const getLastLocation = async () => {
    try {
      const result = await Location.getLastKnownPositionAsync();

      if (result) {
        setLastLocation(result);
      } else {
        alert("No last known location found");
      }
    } catch (error) {
      alert("Unable to get last location");
    }
  };

  const refreshLocation = () => {
    getCurrentLocation();
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Location Permission</Text>

        <Button title="Allow Location" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>

      <Button title="Get Current Location" onPress={getCurrentLocation} />

      <View style={styles.space} />

      <Button title="Get Last Known Location" onPress={getLastLocation} />

      <View style={styles.space} />

      <Button title="Refresh Location" onPress={refreshLocation} />

      {location && (
        <View style={styles.box}>
          <Text style={styles.heading}>Current Location</Text>

          <Text>Latitude: {location.coords.latitude}</Text>

          <Text>Longitude: {location.coords.longitude}</Text>

          <Text>Accuracy: {location.coords.accuracy} m</Text>
        </View>
      )}

      {lastLocation && (
        <View style={styles.box}>
          <Text style={styles.heading}>Last Known Location</Text>

          <Text>Latitude: {lastLocation.coords.latitude}</Text>

          <Text>Longitude: {lastLocation.coords.longitude}</Text>

          <Text>Accuracy: {lastLocation.coords.accuracy} m</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  box: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
  },

  space: {
    height: 10,
  },
});
