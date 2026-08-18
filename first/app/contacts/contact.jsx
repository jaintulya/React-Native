import { Button, FlatList, View, Text, Image } from "react-native";
import * as Contacts from "expo-contacts";
import react, { useState } from "react";
export default function ContactScreen() {
  const [Contact, setContact] = useState(null);
  const handlePermission = async () => {
    const permission = await Contacts.requestPermissionsAsync();

    if (!permission.granted) {
      alert("Not granted");
      return;
    }
       
    const num = await Contacts.getContactsAsync({
      sort: Contacts.SortTypes.FirstName,
    });

    console.log(num);
    setContact(num.data);
  };
  return (
    <View style={{ marginVertical: 92 }}>
      <Button title="Gett permission" onPress={handlePermission} />

      <FlatList
        data={Contact}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            {item?.imageAvailable && item?.image?.uri && (
              <Image
                source={{ uri: item.image.uri }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                }}
              />
            )}
            <Text style={{ color: "white" }}>Name : {item.name}</Text>
            <Text style={{ color: "white" }}>
              PhoneNumbers : {item.phoneNumbers[0].number}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
