import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/colors';
import PrimaryButton from '../components/PrimaryButton';
import SelfieCapture from '../components/SelfieCapture';
import LocationMap from '../components/LocationMap';
import { getCurrentVisitLocation } from '../services/locationService';

export default function HomeScreen({ employeeName, onLogout }) {
  const [name, setName] = useState(employeeName);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [selfieUri, setSelfieUri] = useState(null);
  const [attendance, setAttendance] = useState(null);

  const refreshLocation = async () => {
    setLoadingLocation(true);
    setLocationError('');
    try {
      setLocation(await getCurrentVisitLocation());
    } catch (error) {
      setLocationError(error.message || 'Unable to get the current location.');
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => { refreshLocation(); }, []);

  const submitAttendance = () => {
    if (!name.trim()) return Alert.alert('Employee name required', 'Enter the employee name before submitting.');
    if (!location) return Alert.alert('Location required', 'Refresh and allow location access before submitting.');
    if (!selfieUri) return Alert.alert('Selfie required', 'Capture a selfie before submitting attendance.');
    const record = { employeeName: name.trim(), location, selfieUri, submittedAt: new Date() };
    setAttendance(record);
    Alert.alert('Attendance submitted', 'Your field visit attendance has been recorded.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}><View><Text style={styles.eyebrow}>FIELD VISIT</Text><Text style={styles.title}>Mark attendance</Text></View><Text onPress={onLogout} style={styles.logout}>Logout</Text></View>
        <Text style={styles.label}>Employee name</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Employee name" style={styles.input} />

        <View style={styles.section}><Text style={styles.sectionTitle}>1. Current location</Text>
          {loadingLocation ? <ActivityIndicator color={COLORS.primary} /> : location ? <><Text style={styles.coordinate}>Latitude: {location.latitude.toFixed(6)}</Text><Text style={styles.coordinate}>Longitude: {location.longitude.toFixed(6)}</Text><Text style={styles.address}>{location.address}</Text><View style={styles.mapWrap}><LocationMap latitude={location.latitude} longitude={location.longitude} /></View></> : <Text style={styles.error}>{locationError || 'Location has not been captured.'}</Text>}
          <PrimaryButton title={loadingLocation ? 'Getting location...' : 'Refresh Location'} onPress={refreshLocation} disabled={loadingLocation} tone="outline" />
        </View>

        <View style={styles.section}><Text style={styles.sectionTitle}>2. Attendance selfie</Text><SelfieCapture uri={selfieUri} onCapture={setSelfieUri} /></View>
        <View style={styles.section}><Text style={styles.sectionTitle}>3. Submit attendance</Text><Text style={styles.dateText}>Current date & time: {new Date().toLocaleString()}</Text><PrimaryButton title="Submit Attendance" onPress={submitAttendance} /></View>

        {attendance && <View style={styles.successCard}><Text style={styles.successTitle}>Attendance submitted</Text><Image source={{ uri: attendance.selfieUri }} style={styles.thumbnail} /><Text style={styles.successText}>{attendance.employeeName}</Text><Text style={styles.successText}>{attendance.location.address}</Text><Text style={styles.successText}>{attendance.submittedAt.toLocaleString()}</Text></View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.background, flex: 1 }, content: { padding: 18, paddingBottom: 36 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 }, eyebrow: { color: COLORS.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }, title: { color: COLORS.text, fontSize: 26, fontWeight: '800', marginTop: 3 }, logout: { color: COLORS.primary, fontWeight: '700' },
  label: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginBottom: 7 }, input: { backgroundColor: '#FFFFFF', borderColor: COLORS.border, borderRadius: 12, borderWidth: 1, fontSize: 16, marginBottom: 16, padding: 13 },
  section: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 16, borderWidth: 1, marginBottom: 16, padding: 16 }, sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: '800', marginBottom: 12 }, coordinate: { color: COLORS.text, fontSize: 15, marginBottom: 5 }, address: { color: COLORS.muted, lineHeight: 20, marginBottom: 14, marginTop: 5 }, error: { color: COLORS.danger, lineHeight: 20, marginBottom: 14 }, mapWrap: { marginBottom: 14, overflow: 'hidden', borderRadius: 14 }, dateText: { color: COLORS.muted, marginBottom: 14 },
  successCard: { alignItems: 'center', backgroundColor: '#ECFDF3', borderColor: '#86EFAC', borderRadius: 16, borderWidth: 1, padding: 16 }, successTitle: { color: COLORS.success, fontSize: 18, fontWeight: '800', marginBottom: 10 }, thumbnail: { borderRadius: 40, height: 80, marginBottom: 10, width: 80 }, successText: { color: '#166534', lineHeight: 20, textAlign: 'center' },
});
