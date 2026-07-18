import React, { useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Contacts from "expo-contacts";

const ContactScreen = () => {
  const [contacts, setContacts] = useState([]);

  const getContacts = async () => {
    // Ask for permission
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow contact permission to access your contacts."
      );
      return;
    }

    // Fetch contacts
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (data.length > 0) {
      console.log(data);
      setContacts(data);
    } else {
      Alert.alert("No Contacts", "No contacts found on this device.");
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Get Contacts"
        onPress={getContacts}
      />

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactCard}>
            <Text style={styles.name}>{item.name}</Text>

            {item.phoneNumbers && item.phoneNumbers.length > 0 ? (
              <Text style={styles.phone}>
                {item.phoneNumbers[0].number}
              </Text>
            ) : (
              <Text style={styles.phone}>No Number</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
  },

  contactCard: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  phone: {
    fontSize: 16,
    marginTop: 5,
    color: "gray",
  },
});