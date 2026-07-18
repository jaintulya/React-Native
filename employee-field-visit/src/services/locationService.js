import * as Location from 'expo-location';

const formatAddress = (place) => {
  const parts = [place.name, place.street, place.district, place.city, place.region, place.postalCode, place.country];
  return parts.filter((part, index, list) => part && list.indexOf(part) === index).join(', ');
};

export async function getCurrentVisitLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission was denied. Enable it to mark attendance.');
  }

  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const { latitude, longitude } = position.coords;
  let address = 'Address not available';

  try {
    const places = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (places[0]) address = formatAddress(places[0]) || address;
  } catch {
    // Location is still valid when reverse geocoding is unavailable.
  }

  return { latitude, longitude, address };
}
