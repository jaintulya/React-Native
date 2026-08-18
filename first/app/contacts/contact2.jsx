import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  Image,
} from "react-native";

import * as Contacts from "expo-contacts";
import { useState } from "react";

export default function ContactScreen() {
  const [contacts, setContacts] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const getContacts = async () => {
    const permission = await Contacts.requestPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Denied", "Contact permission is required.");

      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
    });

    setContacts(data);
  };

  const handleSaveContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Error", "Name and phone number required");

      return;
    }

    try {
      const permission = await Contacts.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission Denied", "Contact permission is required.");

        return;
      }

      const contact = {
        [Contacts.Fields.FirstName]: name,

        phoneNumbers: [
          {
            label: "mobile",
            number: phone,
          },
        ],
      };

      await Contacts.presentFormAsync(null, contact, {
        isNew: true,
      });

      setName("");
      setPhone("");

      getContacts();
    } catch (error) {
      console.log("CONTACT ERROR:", error);

      Alert.alert("Error", "Unable to open contact form");
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Delete Contact",
      `Are you sure you want to delete this contact ${item.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await Contacts.removeContactAsync(item.id);

              setContacts((prev) => prev.filter((ele) => ele.id !== item.id));
            } catch (error) {
              Alert.alert("Error", "Could not delete contact");
            }
          },
        },
      ],
    );
  };

  const renderContact = ({ item }) => {
    const phone = item.phoneNumbers?.[0]?.number || "No Phone Number";

    const firstLetter = item.name?.charAt(0)?.toUpperCase() || "?";

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 15,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 12,
          backgroundColor: "white",
        }}
      >
        {item.imageAvailable && item.image?.uri ? (
          <Image
            source={{
              uri: item.image.uri,
            }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
          />
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#4F46E5",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {firstLetter}
            </Text>
          </View>
        )}

        <View
          style={{
            flex: 1,
            marginLeft: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#222",
            }}
            numberOfLines={1}
          >
            {item.name || "Unknown Name"}
          </Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 14,
              color: "#666",
            }}
          >
            {phone}
          </Text>
        </View>

        <Button title="Delete" color="red" onPress={() => handleDelete(item)} />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop: 60,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
          color: "black",
        }}
      >
        Contact Screen
      </Text>

      <Text
        style={{
          color: "black",
          marginBottom: 5,
        }}
      >
        Name
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
        placeholderTextColor="gray"
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          padding: 10,
          marginBottom: 15,
          backgroundColor: "white",
          color: "black",
          borderRadius: 6,
        }}
      />

      <Text
        style={{
          color: "black",
          marginBottom: 5,
        }}
      >
        Phone
      </Text>

      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        placeholderTextColor="gray"
        keyboardType="phone-pad"
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          padding: 10,
          marginBottom: 15,
          backgroundColor: "white",
          color: "black",
          borderRadius: 6,
        }}
      />

      <Button title="Save Contact" onPress={handleSaveContact} />

      <View
        style={{
          marginTop: 10,
        }}
      >
        <Button title="Get Contacts" onPress={getContacts} />
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        contentContainerStyle={{
          marginTop: 20,
          paddingBottom: 20,
        }}
      />
    </View>
  );
}
