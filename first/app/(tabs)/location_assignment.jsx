import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import * as Location from "expo-location";

export default function LocationAssignment() {
  const [Locations, setLocations] = useState(null);
  const [Last, setLast] = useState();
  const [Address, setAddress] = useState(null);

  const handleLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      alert("Permission Denied");
      return;
    } else {
      alert("Permission Successful")
    }

    const getCurrent = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    console.log(getCurrent);
    setLocations(getCurrent);
  };

  const handleLastLocation = async () => {
    const lastLocation = await Location.getLastKnownPositionAsync();

    console.log(lastLocation);
    setLast(lastLocation);
  };

  const handleAddress = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      alert("Permission Denied");
      return;
    }

    const geoCurr = await Location.getCurrentPositionAsync();

    const address = await Location.reverseGeocodeAsync({
      latitude: geoCurr.coords.latitude,
      longitude: geoCurr.coords.longitude,
    });

    console.log(address);
    setAddress(address[0]);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Button title="Get Current Location" onPress={handleLocation} />

      {Locations && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "white" }}>
            Accuracy: {Locations.coords.accuracy}
          </Text>

          <Text style={{ color: "white" }}>
            Latitude: {Locations.coords.latitude}
          </Text>

          <Text style={{ color: "white" }}>
            Longitude: {Locations.coords.longitude}
          </Text>

          <Text style={{ color: "white" }}>
            Speed: {Locations.coords.speed}
          </Text>

          <Text style={{ color: "white" }}>
            Heading: {Locations.coords.heading}
          </Text>

          <Text style={{ color: "white" }}>
            Altitude: {Locations.coords.altitude}
          </Text>
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title="Get Last Known Location"
          onPress={handleLastLocation}
        />
      </View>

      {Last === undefined ? null : Last ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "white" }}>
            Last Latitude: {Last.coords.latitude}
          </Text>

          <Text style={{ color: "white" }}>
            Last Longitude: {Last.coords.longitude}
          </Text>

          <Text style={{ color: "white" }}>
            Last Accuracy: {Last.coords.accuracy}
          </Text>
        </View>
      ) : (
        <Text style={{ color: "white", marginTop: 20 }}>
          No Last Known Location Found
        </Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Get Address" onPress={handleAddress} />
      </View>

      {Address && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "white" }}>
            Name: {Address.name}
          </Text>

          <Text style={{ color: "white" }}>
            Street: {Address.street}
          </Text>

          <Text style={{ color: "white" }}>
            City: {Address.city}
          </Text>

          <Text style={{ color: "white" }}>
            Postal Code: {Address.postalCode}
          </Text>

          <Text style={{ color: "white" }}>
            Region: {Address.region}
          </Text>

          <Text style={{ color: "white" }}>
            Country: {Address.country}
          </Text>
        </View>
      )}
    </View>
  );
}