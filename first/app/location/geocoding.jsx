import { Button, View,Text } from "react-native";
import * as Location from "expo-location";
import { useState } from "react";
export default function geoScreen(){

const [Address,setAddress]=useState(null)
const handlePermission= async ()=>{
  const permission = await Location.getForegroundPermissionsAsync()

  if(!permission.granted){
    alert("permission denied")
    return ;
  
  }
 const getCurrent = await Location.getCurrentPositionAsync();



const result = await Location.reverseGeocodeAsync({
  latitude: getCurrent.coords.latitude,
  longitude: getCurrent.coords.longitude,
});


  console.log(result);
  setAddress(result[0]);
  const add= await Location.geocodeAsync("Dahod,Gujarat")
console.log(add)

}


  return (
    <View style={{flex:1,justifyContent:"center",}}>
      <Button title="Get Address" onPress={handlePermission}/>


  {Address && (
        <View style={{ marginTop: 20 }}>
       
<Text style={{ color: "white" }}>
  {Address.name}, {Address.street}, {Address.city}, {Address.postalCode}
</Text>

        </View>
  )}
    </View>
  )
}