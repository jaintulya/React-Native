import { View, Text, Button, TextInput } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";

export default function Clip() {
  const [text, setText] = useState("");
const [res, setRes] = useState("");

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
    setText("");
  };

  const handlePaste = async () => {

    const hasText =
  await Clipboard.hasStringAsync();
console.log(hasText)

  if(!hasText){
    alert("Clipboard empty")
  } 
    const result=await Clipboard.getStringAsync();
    
    setRes(result);

    
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      

      <TextInput
        placeholder="Enter Something..."
        value={text}
        onChangeText={setText}
        style={{borderColor:"Black",borderWidth:1}}
      />
<Text/>
      <Button title="Copy Text" onPress={handleCopy} />
      <Text/>

  <Button title="Paste Text" onPress={handlePaste} />

{res && (
  <View>
    <Text style={{color:"Black"}}>{res}</Text>
  </View>
)}
  
    </View>
  );
}