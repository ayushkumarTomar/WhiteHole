import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '@/components/loading';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { Raleway_500Medium, useFonts } from '@expo-google-fonts/raleway';
import { combineMetaDataWithSong, deleteDownloadedSong, getFavourites, listDownloadedSongs, removeDownloadedMetaData, removeFavourite } from '@/lib/storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Swipeable } from 'react-native-gesture-handler';
import { Link } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Track } from '@/lib/mediaProcess';

interface ListItemProps {
  item: Track;
  onDelete: (songId: string) => void;
}



const ListItem = ({ item, onDelete }: ListItemProps) => {
  const leftSwipe = () => (
    <View style={styles.leftSwipeContainer}>
      <TouchableOpacity onPress={() => onDelete(item.songId)}>
        <AntDesign name="delete" size={s(24)} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderLeftActions={leftSwipe} renderRightActions={() => null}>
      <Link href={{ pathname: '/(pages)/music/storedMusic', params: { musicId: item.songId} }} asChild>
      <TouchableOpacity style={styles.playlistItem}>
           <View style={{opacity:0.4 , backgroundColor:'#bbb' , borderRadius:vs(10) , paddingHorizontal:vs(6), justifyContent:'center'}}> 

           <MaterialIcons name="music-note" size={vs(15)} color="white" />            
            </View> 
        
        <View style={{ flex: 1 , alignItems:'flex-start'}}> 
          <Text style={styles.playlistName}>{item.title}</Text>
          <Text style={styles.artists} numberOfLines={1}>{item.artist}</Text>
          <Text style={styles.songDuration}>
          {//@ts-ignore
        `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}`}
        </Text>


        </View>

      </TouchableOpacity>
      </Link>
    </Swipeable>
  );
};

const Downloads = () => {
  const [fontsLoaded] = useFonts({ Raleway_500Medium });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [downloads, setDownloads] = useState<Track[]>([]);

  useEffect(() => {
    const loadDownloads = async () => {
      const downloadArray = await combineMetaDataWithSong();
      console.log("downloaded array :: " , downloadArray)
      setDownloads(downloadArray);
      setIsLoading(false);
    };
    loadDownloads();
  }, []);

  if (!fontsLoaded || isLoading) return <Loading />;

  const renderHeader = useMemo(
    () => (
      <View style={styles.albumHeader}>
        <Text style={styles.playlistHeader}>Downloads</Text>
      </View>
    ),
    []
  );

  const handleDelete = (songId: string) => {
    deleteDownloadedSong(songId)
    removeDownloadedMetaData(songId)
    setDownloads(prev => prev.filter(el => el.songId !== songId));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
          style={styles.gradient}
        />
        <FlatList
          data={downloads}
          keyExtractor={(item) => item.songId}
          ListEmptyComponent={() => <Text style={styles.emptyComponent}>No favourites found</Text>}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => <ListItem item={item} onDelete={handleDelete} />}
        />
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
    fontFamily: 'Raleway_500Medium',
    fontSize: vs(15),
    marginTop: vs(10),
    marginBottom: vs(14),
    color: 'white',
  },
  playListCover: {
    width: vs(30),
    height: vs(30),
    borderRadius: vs(10),
  },
  albumHeader: {
    alignItems: 'center',
    paddingVertical: vs(20),
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
    fontSize: vs(9),
    color: 'white',
  },
  emptyComponent: {
    fontFamily: 'Raleway_500Medium',
    fontSize: vs(12),
    color: 'white',
    textAlign: 'center',
  },
  leftSwipeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: vs(20),
    // height: '100%',
  },
  artists: {
    fontFamily: 'Raleway_500Medium',
    fontSize: vs(7),
    color: '#bbb',
  } ,
  songDuration: {
    fontFamily: 'Raleway_500Medium',
    color: '#888',
    fontSize: vs(8),
  },
});

export default Downloads;
