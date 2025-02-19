import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '@/components/loading';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { Raleway_500Medium, useFonts } from '@expo-google-fonts/raleway';
import Ionicons from '@expo/vector-icons/Ionicons';
import { deletePlaylist, getPlaylists } from '@/lib/storage';
import PlayListModal from '@/components/playlistModal';
import { Swipeable } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Track } from '@/lib/mediaProcess';
import { PlaylistStorage } from '@/types/playlist';


interface ListItemProps {
  item: Item;
  onDelete: (playListId: string) => void;
}

interface Item {
  artwork?: string;
  name: string;
  playListId: string;
  songs?: Track[]
}


const ListItem = ({ item , onDelete }: ListItemProps) => {
  const rightSwipe = () => (
    <View style={{ backgroundColor: 'transparent', height: "100%", justifyContent: 'center', alignItems: 'center', padding: vs(20) }} >
  
      <TouchableOpacity onPress={() => onDelete(item.playListId)}>
              <AntDesign name="delete" size={s(24)} color="white" />
      </TouchableOpacity>
    </View>
  )
  return (
  <Swipeable
    renderLeftActions={rightSwipe}
    renderRightActions={() => null}
    // containerStyle={{ backgroundColor: 'green' }}
  >
    <Link href={{ pathname: '/(pages)/library/[storedPlaylist]', params: { storedPlaylist: item.playListId } }} style={{borderBottomColor: '#333', borderBottomWidth: 1,}}>

      <View style={styles.playlistItem}>
        {item.artwork ? <Image source={{ uri: item.artwork }} style={styles.playListCover} /> : <Image source={require('../../../assets/images/placeholder.jpg')} style={styles.playListCover} />}
        <Text style={styles.playlistName}>{item.name}</Text>

      </View>
    </Link>


  </Swipeable>

)
};


const AddToPlaylistScreen = () => {
  const [fontsLoaded] = useFonts({ Raleway_500Medium });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playlists, setPlaylists] = useState<PlaylistStorage[]>();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {

    const loadPlaylists = async () => {

      const playlistArray = await getPlaylists();
      setPlaylists(playlistArray);
      setIsLoading(false)
      console.log("playlists :: ", playlistArray)
    };
    loadPlaylists();
  }, []);
  const savePlayListToStorage = async (playlistName: string) => {
  }

  const handleDelete = (playListId: string) => {
      setPlaylists(prev => prev?.filter(playlist => playlist.playListId !== playListId));
      deletePlaylist(playListId);
    };

  const renderHeader = useMemo(() => (
    <View style={styles.albumHeader}>
      <Text style={styles.playlistHeader}>PlayLists</Text>
      <TouchableOpacity style={styles.createPlaylist} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  ) , [])

  if (!fontsLoaded || isLoading) return <Loading />;



  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
          style={styles.gradient}
        />
        <FlatList
          data={playlists}
          keyExtractor={(item: any) => item.playListId.toString()}
          ListEmptyComponent={() => <Text style={styles.emptyComponent}>No favourites found</Text>}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => <ListItem item={item} onDelete={handleDelete} />}
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
  headerTitle: {
    fontFamily: 'Raleway_500Medium',
    fontSize: vs(15),
    marginTop: vs(10),
    color: 'white',
  },
  playlistItem: {
    paddingVertical: vs(15),
    paddingHorizontal: s(20),
    flexDirection: 'row',
    gap: s(20),
    
  },
  playlistName: {
    fontFamily: 'Raleway_500Medium',
    fontSize: vs(12),
    color: 'white',
    alignSelf: 'center',
    verticalAlign: 'middle'
  },

  emptyComponent: {
    fontFamily: 'Raleway_500Medium',
    fontSize: vs(15),
    color: 'white',
    textAlign: 'center',
  },
  leftSwipe: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: s(100),
    padding: s(20)
  }
});

export default AddToPlaylistScreen;
