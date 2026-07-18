import React from 'react';
import MapView, { Marker } from 'react-native-maps';

export default function LocationMap({ latitude, longitude }) {
  const region = { latitude, longitude, latitudeDelta: 0.008, longitudeDelta: 0.008 };
  return <MapView style={{ height: 220, borderRadius: 14 }} initialRegion={region}><Marker coordinate={region} title="Attendance location" /></MapView>;
}
