import { Button, View, Text } from "react-native";
import * as location from "expo-location";
import { useState } from "react";
export default function locationScreen() {
  const handlePermission = async () => {
    const result = await location.requestForegroundPermissionsAsync();
    console.log(result);
  };

  const [locations, setLocations] = useState("");
  const handleCurrentlocation = async () => {
    const curr = await location.getCurrentPositionAsync();
    console.log(curr);
    setLocations(curr);
  };

  return (
    <View style={{ marginTop: 100 }}>
      <Button title="Grant Permission" onPress={handlePermission} />

      <Button title="get curr location" onPress={handleCurrentlocation} />

      {locations && (
        <View>
          <Text style={{ color: "white" }}>
            Accuracy:{locations.coords.accuracy} Longitude:
            {locations.coords.longitude} Latitude:
            {locations.coords.latitude}{" "}
          </Text>
        </View>
      )}
    </View>
  );
}
