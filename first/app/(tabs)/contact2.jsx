import { View, Text, Button, FlatList, Image, TextInput } from "react-native";
import * as Contacts from "expo-contacts";
import { useState } from "react";

export default function ContactScreen() {
  const [contactdata, setContactdata] = useState([]);
  const [searchContact, setSearchContact] = useState("");

  const handleGetContacts = async () => {
    const permission = await Contacts.requestPermissionsAsync();

    if (!permission.granted) {
      alert("Permission denied");
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      sort: Contacts.ContactTypes.FirstName,
    });

    setContactdata(data);
  };

  const searchData = contactdata.filter((ele) => {
    const name = ele.name?.toLowerCase() || "";
    const phone = ele.phoneNumbers?.[0]?.number || "";

    return (
      name.includes(searchContact.toLowerCase()) ||
      phone.includes(searchContact)
    );
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "teal",
        paddingTop: 100,
      }}
    >
      <Text>ContactScreen</Text>

      <Button title="Get Contacts" onPress={handleGetContacts} />

      <TextInput
        placeholder="Search contacts..."
        style={{
          padding: 10,
          backgroundColor: "white",
          margin: 10,
        }}
        value={searchContact}
        onChangeText={setSearchContact}
      />

      <FlatList
        data={searchData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
            }}
          >
            {item.imageAvailable && item.image?.uri ? (
              <Image
                source={{ uri: item.image.uri }}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                }}
              />
            ) : (
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  backgroundColor: "gray",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {item.name?.[0]}
                </Text>
              </View>
            )}

            <View>
              <Text
                style={{
                  marginLeft: 10,
                  color: "white",
                }}
              >
                {item.name}
              </Text>

              <Text
                style={{
                  marginLeft: 10,
                  color: "white",
                }}
              >
                {item.phoneNumbers?.[0]?.number || "No phone number"}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
