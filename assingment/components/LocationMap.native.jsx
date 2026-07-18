import React from 'react';
import MapView, { Marker } from 'react-native-maps';

export default function LocationMap({ style, region }) {
  return (
    <MapView style={style} initialRegion={region} showsUserLocation>
      <Marker coordinate={region} title="Your current location" />
    </MapView>
  );
}
