import React, { useRef, useState } from "react";
import { View, Text, Button } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const statRef = useRef(null);

  const handleStartTracker = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      alert("Location permission denied");
      return;
    }

    statRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
        timeInterval: 5000,
      },
      (refLocation) => {
        console.log(refLocation);
        setLocation(refLocation);
      }
    );
  };

  const handleStopTracker = () => {
    
    if (statRef.current) {
      statRef.current.remove();
      statRef.current = null;
      console.log("Tracking Stopped");
      setLocation(null);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "teal",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 22,
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        Location Tracker
      </Text>

      <Button title="Start Tracking" onPress={handleStartTracker} />

      <View style={{ height: 15 }} />

      <Button title="Stop Tracking" onPress={handleStopTracker} />

      {location && (
        <View
          style={{
            marginTop: 20,
            width: "100%",
          }}
        >
          <Text style={{ color: "white" }}>
            Accuracy: {location.coords.accuracy}
          </Text>

          <Text style={{ color: "white" }}>
            Latitude: {location.coords.latitude}
          </Text>

          <Text style={{ color: "white" }}>
            Longitude: {location.coords.longitude}
          </Text>

          <MapView
            style={{
              width: "100%",
              height: 300,
              marginTop: 20,
            }}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
       
            />
          </MapView>
        </View>
      )}
    </View>
  );
}