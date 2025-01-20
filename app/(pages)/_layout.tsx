import MusicPlayer from "@/components/player";
import { Stack } from "expo-router";
import { Text } from "react-native";
const Footer = ()=>{
  return (
    <Text style={{color:"white" , fontSize:59}}>FOOTER</Text>
  )
}


export default function PagesLayout() {
  return (

    
      <Stack>
        <Stack.Screen 
          name="playlist"
          options={{headerShown:false}}
        />

      {/* <Stack.Screen
          name="playlist/[playListId]"
          options={{
            title: 'Playlist Details',
            headerShown: false,
            animation:"slide_from_right"
          }}
        /> */}

      <Stack.Screen
          name="library"
          options={{
            title: 'Playlist',
            headerShown: false,
            animation:"slide_from_right"
          }}/>
        <Stack.Screen
          name="album/[albumId]"
          options={{
            title: 'Album Details',
            headerShown: false,
            animation:'slide_from_left'
          }}
        />
        <Stack.Screen
          name="music"
          options={{
            title: 'Music Details',
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />

      <Stack.Screen
          name="queue/index"
          options={{
            title: 'Queue',
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
  );
}
