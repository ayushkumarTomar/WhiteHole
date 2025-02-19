import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { getLastSession, getPlaylists } from '@/lib/storage';
import { s, vs } from 'react-native-size-matters';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; 
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; 
import { Link } from 'expo-router';
import Loading from '@/components/loading';
const Library = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    Montserrat_500Medium
  });
  if(!fontsLoaded) return <Loading/>;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
          style={styles.gradient}
        />
        <ScrollView>
          <View style={styles.header}>

            <Entypo name="folder-music" size={24} color="white" />
            <Text style={styles.headerText}>
              Your Music, Your Moments{"\n"}
              <Text style={[styles.headerText, { fontSize: vs(20) }]}>
                Relive, Explore, and Groove All Over Again!
              </Text>
            </Text>
          </View>
          <View style={styles.libraryContainer}>

            
            <Link href={"/(pages)/library/playlist"} asChild>
         <TouchableOpacity style={styles.playlistContainer}>
         <MaterialCommunityIcons name="playlist-music-outline" size={24} color="white" />

         <Text style={styles.contentText}>Playlists</Text>

         </TouchableOpacity>
         </Link>
         <Link href={"/(pages)/library/favourite"} asChild>
         <TouchableOpacity style={styles.playlistContainer}>
         <MaterialIcons name="favorite-border" size={24} color="white" />
         <Text style={styles.contentText}>Favourites</Text>

         </TouchableOpacity>
         </Link>

         <Link href={"/(pages)/library/downloads"} asChild>
         <TouchableOpacity style={styles.playlistContainer}>
         <MaterialIcons name="cloud-download" size={24} color="white" />
         <Text style={styles.contentText}>Downloads</Text>

         </TouchableOpacity>
         </Link>

         </View>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "30%",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: vs(10),
    marginTop: vs(30),
  },
  headerText: {
    color: "white",
    fontFamily: "Montserrat_700Bold",
    marginLeft: s(10),
  },
  libraryContainer:{
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap:s(20),
    marginHorizontal:s(25) ,
    width:"100%"
  } ,
  playlistContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap:s(20) ,
    alignItems: 'center',
    width:'100%'
  },
  contentText:{
    color: "white",
    fontFamily: "Montserrat_500Medium",
    fontSize:vs(10)
  }
});


export default Library;