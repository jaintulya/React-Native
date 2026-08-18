import {View,Button,Text} from "react-native"
import { useState } from "react";
export default function counter(){

const [count , setCount]= useState(0);
  const handleCount =()=>{
    setCount(count+1);
    
  }

   const handleCountmin =()=>{
    setCount(pre => pre > 0 ? pre - 1 : 0);
    
  }
  return(
    <View style={{flex:1,justifyContent:"center"}}>
      <Button title="count ++ " onPress={handleCount}/>
      <Text style={{color:"white"}}>{count}</Text>

       <Button title="count -- " onPress={handleCountmin}/>
      <Text style={{color:"white"}}>{count}</Text>
    </View>
  )
}