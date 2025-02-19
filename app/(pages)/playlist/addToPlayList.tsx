import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '@/components/loading';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { Raleway_500Medium, useFonts } from '@expo-google-fonts/raleway';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getPlaylists, savePlaylist } from '@/lib/storage';
import PlayListModal from '@/components/playlistModal';
import { getSongParsedData } from '@/lib/mediaProcess';
import { PlaylistStorage } from '@/types/playlist';

const AddToPlaylistScreen = () => {
  const { songId } = useLocalSearchParams<{ songId: string }>()
  const [fontsLoaded] = useFonts({ Raleway_500Medium })

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [playlists, setPlaylists] = useState<any>(null)
  const [modalVisible, setModalVisible] = useState(false)


  useEffect(() => {

    const loadPlaylists = async () => {

      const playlistArray = await getPlaylists()
      setPlaylists(playlistArray)
      setIsLoading(false)
    };
    loadPlaylists();
  }, []);
  if (!fontsLoaded || isLoading) return <Loading />;
  const savePlayListToStorage = async (playListName :string) => {
    const songData = await getSongParsedData(songId);
    if (songData) {
      const newPlaylists = await savePlaylist(songData, playListName);
      ToastAndroid.show(`Added to ${playListName}`, ToastAndroid.SHORT)
      setPlaylists(newPlaylists)
      setModalVisible(false);

    }
  }

  const renderHeader = () => (
    <View style={styles.albumHeader}>
      <Text style={styles.playlistHeader}>PlayLists</Text>
      <TouchableOpacity style={styles.createPlaylist} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
          style={styles.gradient}
        />
        <FlatList
          data={playlists}
          keyExtractor={(item:PlaylistStorage) => item.playListId.toString()}
          ListEmptyComponent={() => <Text style={styles.emptyComponent}>No playlists found</Text>}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.playlistItem}
              onPress={() => savePlayListToStorage(item.name)}
            >
              {item.artwork ? <Image source={{ uri: item.artwork }} style={styles.playListCover} /> : <Image source={require('../../../assets/images/placeholder.jpg')} style={styles.playListCover} />}
              <Text style={styles.playlistName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <PlayListModal isVisible={modalVisible} onClose={() => setModalVisible(false)} onCreatePlaylist={savePlayListToStorage} />



      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },

  playlistHeader: {
    fontFamily: "Raleway_500Medium",
    fontSize: vs(15),
    marginTop: vs(10),
    marginBottom: vs(14),
    color: 'white',
  },

  playListCover: { 
    width: vs(30), 
    height: vs(30), 
    borderRadius: vs(10) 
  },

  albumHeader: {
    alignItems: 'center',
    paddingVertical: vs(20),
  },

  createPlaylist: {
    position: 'absolute',
    right: vs(20),
    top: vs(30),
  },

  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '60%',
  },
  playlistItem: {
    paddingVertical: vs(15),
    paddingHorizontal: s(20),
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: s(20),
  },
  playlistName: {
    fontFamily: 'Raleway_500Medium',
    fontSize: vs(12),
    color: 'white',
    alignSelf: 'center',
    verticalAlign:'middle'
  },

  emptyComponent: {
    fontFamily: 'Raleway_500Medium',
    fontSize: vs(15),
    color: 'white',
    textAlign: 'center',
  }
});

export default AddToPlaylistScreen;
