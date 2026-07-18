import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import LocationMap from '../../components/LocationMap';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage(canAskAgain ? 'Location permission was denied. Tap the button to try again.' : 'Location permission is permanently denied. Enable it in your device or browser settings.');
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(currentLocation.coords);
    } catch {
      setErrorMessage('Could not fetch location. Allow location access and try again.');
    } finally {
      setLoading(false);
    }
  };

  const region = location && { latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Student Management App</Text>
      <View style={styles.locationCard}>
        <Text style={styles.locationTitle}>Your Current Location</Text>
        {!location && !errorMessage && !loading ? <Text style={styles.helperText}>Tap the button to show your location on the map.</Text> : loading ? <ActivityIndicator size="small" color="#2563eb" /> : errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : <><LocationMap style={styles.map} region={region} /><Text style={styles.locationText}>Latitude: {location.latitude.toFixed(6)}</Text><Text style={styles.locationText}>Longitude: {location.longitude.toFixed(6)}</Text></>}
        <View style={styles.buttonSpace}><Button title={location ? 'Refresh Location' : 'Get Location'} onPress={getCurrentLocation} /></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 64, backgroundColor: '#ffffff' },
  title: { fontSize: 20, marginBottom: 24, textAlign: 'center' },
  locationCard: { flex: 1, padding: 18, borderRadius: 12, backgroundColor: '#eff6ff' },
  locationTitle: { fontSize: 17, fontWeight: '600', marginBottom: 12 },
  map: { width: '100%', height: 320, borderRadius: 10, marginBottom: 14 },
  locationText: { fontSize: 16, marginBottom: 6 },
  helperText: { fontSize: 15, marginBottom: 12, color: '#475569' },
  errorText: { color: '#b91c1c', lineHeight: 20, marginBottom: 12 },
  buttonSpace: { marginTop: 12 },
});
