import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Linking,
  Share,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { useState } from "react";

export default function MapsScreen() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(null);
  const [history, setHistory] = useState([]);

  const [lat1, setLat1] = useState("");
  const [lon1, setLon1] = useState("");
  const [lat2, setLat2] = useState("");
  const [lon2, setLon2] = useState("");

  const searchLocation = async () => {
    if (!search.trim()) {
      return;
    }

    try {
      const result = await Location.geocodeAsync(search);

      if (result.length === 0) {
        alert("Location not found");
        return;
      }

      const place = result[0];

      setLocation({
        latitude: place.latitude,
        longitude: place.longitude,
      });

      setHistory([
        ...history,
        {
          name: search,
          latitude: place.latitude,
          longitude: place.longitude,
        },
      ]);
    } catch (error) {
      alert("Unable to search location");
    }
  };

  const openGoogleMaps = () => {
    if (!location) {
      return;
    }

    const url =
      `https://www.google.com/maps?q=` +
      `${location.latitude},${location.longitude}`;

    Linking.openURL(url);
  };

  const shareCoordinates = async () => {
    if (!location) {
      return;
    }

    await Share.share({
      message:
        `Latitude: ${location.latitude}\n` +
        `Longitude: ${location.longitude}`,
    });
  };

  const calculateDistance = () => {
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      alert("Enter all coordinates");
      return;
    }

    const latitude1 = Number(lat1);
    const longitude1 = Number(lon1);
    const latitude2 = Number(lat2);
    const longitude2 = Number(lon2);

    const R = 6371;

    const dLat =
      ((latitude2 - latitude1) * Math.PI) / 180;

    const dLon =
      ((longitude2 - longitude1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((latitude1 * Math.PI) / 180) *
        Math.cos((latitude2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    const distance = R * c;

    alert(
      `Distance: ${distance.toFixed(2)} km`
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.title}>
        Maps & Utilities
      </Text>

      <View style={styles.box}>

        <Text style={styles.heading}>
          Search Location
        </Text>

        <TextInput
          placeholder="Enter location"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />

        <Button
          title="Search"
          onPress={searchLocation}
        />

      </View>

      {location && (
        <View style={styles.box}>

          <Text style={styles.heading}>
            Location Details
          </Text>

          <Text>
            Latitude: {location.latitude}
          </Text>

          <Text>
            Longitude: {location.longitude}
          </Text>

          <View style={styles.space} />

          <Button
            title="Open in Google Maps"
            onPress={openGoogleMaps}
          />

          <View style={styles.space} />

          <Button
            title="Share Coordinates"
            onPress={shareCoordinates}
          />

        </View>
      )}

      <View style={styles.box}>

        <Text style={styles.heading}>
          Distance Calculator
        </Text>

        <TextInput
          placeholder="Latitude 1"
          value={lat1}
          onChangeText={setLat1}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Longitude 1"
          value={lon1}
          onChangeText={setLon1}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Latitude 2"
          value={lat2}
          onChangeText={setLat2}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Longitude 2"
          value={lon2}
          onChangeText={setLon2}
          keyboardType="numeric"
          style={styles.input}
        />

        <Button
          title="Calculate Distance"
          onPress={calculateDistance}
        />

      </View>

      <View style={styles.box}>

        <Text style={styles.heading}>
          Recent Location History
        </Text>

        {history.length === 0 ? (
          <Text>No locations yet</Text>
        ) : (
          history.map((item, index) => (
            <View
              key={index}
              style={styles.historyItem}
            >

              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text>
                Latitude: {item.latitude}
              </Text>

              <Text>
                Longitude: {item.longitude}
              </Text>

            </View>
          ))
        )}

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  box: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },

  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },

  name: {
    fontWeight: "bold",
    marginBottom: 3,
  },

  space: {
    height: 10,
  },
});