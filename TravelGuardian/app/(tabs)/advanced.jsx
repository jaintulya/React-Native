import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Linking,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { useRef, useState } from "react";

export default function AdvancedLocation() {
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [address, setAddress] = useState(null);
  const [heading, setHeading] = useState(null);

  const [search, setSearch] = useState("");
  const [searchedLocation, setSearchedLocation] = useState(null);

  const locationSubscription = useRef(null);
  const headingSubscription = useRef(null);

  const startTracking = async () => {
    const permission =
      await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      alert("Location permission denied");
      return;
    }

    setAddress(null);
    setHeading(null);
    setSearchedLocation(null);

    locationSubscription.current =
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
        },
        (result) => {
          setLocation(result);
        }
      );

    headingSubscription.current =
      await Location.watchHeadingAsync((result) => {
        setHeading(result.trueHeading);
      });

    setTracking(true);
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    if (headingSubscription.current) {
      headingSubscription.current.remove();
      headingSubscription.current = null;
    }

    setTracking(false);
    setLocation(null);
    setAddress(null);
    setHeading(null);
  };

  const getAddress = async () => {
    if (!location) {
      alert("Start tracking first");
      return;
    }

    try {
      const result =
        await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

      if (result.length > 0) {
        const place = result[0];

        setAddress({
          name: place.name,
          street: place.street,
          city: place.city,
          region: place.region,
          country: place.country,
          postalCode: place.postalCode,
        });
      }
    } catch (error) {
      alert("Unable to get address");
    }
  };

  const searchLocation = async () => {
    if (!search.trim()) {
      return;
    }

    try {
      const result =
        await Location.geocodeAsync(search);

      if (result.length === 0) {
        alert("Location not found");
        return;
      }

      setSearchedLocation(result[0]);
    } catch (error) {
      alert("Unable to search location");
    }
  };

  const openSearchedLocation = () => {
    if (!searchedLocation) {
      return;
    }

    const url =
      `https://www.google.com/maps?q=` +
      `${searchedLocation.latitude},` +
      `${searchedLocation.longitude}`;

    Linking.openURL(url);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.title}>
        Advanced Location
      </Text>

      <Button
        title={
          tracking
            ? "Tracking..."
            : "Start Live Tracking"
        }
        onPress={startTracking}
        disabled={tracking}
      />

      <View style={styles.space} />

    <Button
  title="Stop Tracking"
  onPress={stopTracking}
  disabled={!tracking}
/>

      {location && (
        <View style={styles.box}>

          <Text style={styles.heading}>
            Live Location
          </Text>

          <Text>
            Latitude: {location.coords.latitude}
          </Text>

          <Text>
            Longitude: {location.coords.longitude}
          </Text>

          <Text>
            Accuracy: {location.coords.accuracy} m
          </Text>

          <Text>
            Altitude: {location.coords.altitude} m
          </Text>

          <Text>
            Speed: {location.coords.speed} m/s
          </Text>

          <Text>
            GPS Heading: {location.coords.heading}
          </Text>

          <View style={styles.space} />

          <Button
            title="Get Address"
            onPress={getAddress}
          />

        </View>
      )}

      {address && (
        <View style={styles.box}>

          <Text style={styles.heading}>
            Current Address
          </Text>

          <Text>
            Name: {address.name || "N/A"}
          </Text>

          <Text>
            Street: {address.street || "N/A"}
          </Text>

          <Text>
            City: {address.city || "N/A"}
          </Text>

          <Text>
            Region: {address.region || "N/A"}
          </Text>

          <Text>
            Country: {address.country || "N/A"}
          </Text>

          <Text>
            Postal Code: {address.postalCode || "N/A"}
          </Text>

        </View>
      )}

      {heading !== null && (
        <View style={styles.box}>

          <Text style={styles.heading}>
            Compass
          </Text>

          <Text>
            Direction: {heading.toFixed(0)}°
          </Text>

          <Text>
            0° = North
          </Text>

          <Text>
            90° = East
          </Text>

          <Text>
            180° = South
          </Text>

          <Text>
            270° = West
          </Text>

        </View>
      )}

      <View style={styles.box}>

        <Text style={styles.heading}>
          Search Location
        </Text>

        <TextInput
          placeholder="Enter place or address"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />

        <Button
          title="Search"
          onPress={searchLocation}
        />

        {searchedLocation && (
          <View style={styles.result}>

            <Text>
              Latitude: {searchedLocation.latitude}
            </Text>

            <Text>
              Longitude: {searchedLocation.longitude}
            </Text>

            <View style={styles.space} />

            <Button
              title="Open in Google Maps"
              onPress={openSearchedLocation}
            />

          </View>
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
    padding: 15,
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
    marginTop: 15,
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

  result: {
    marginTop: 10,
  },

  space: {
    height: 10,
  },
});