import { Button, View, Text, FlatList, TextInput } from "react-native";
import * as Contacts from "expo-contacts";
import { useState } from "react";

export default function ContactScreen() {
  const [Contact, setContact] = useState([]);

  const handlePermission = async () => {
    const permission = await Contacts.requestPermissionsAsync();

    console.log(permission);

    if (!permission.granted) {
      alert("Decline");
      return;
    }

    const con = await Contacts.getContactsAsync();

    console.log(con.data);

    setContact(con.data);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>

      <Button title="Get Contacts" onPress={handlePermission} />
<TextInput />
      <FlatList
        data={Contact}
        renderItem={({ item }) => (
          <View>
            <Text style={{ color: "white" }}>
              Name: {item.firstName}
            </Text>

            <Text style={{ color: "white" }}>
              Number: {item.phoneNumbers[0].number}
            </Text>
          </View>
        )}    
        
      />

    </View>
  );
} 