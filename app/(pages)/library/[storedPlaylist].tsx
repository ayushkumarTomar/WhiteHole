import { View, Text, FlatList, StyleSheet, Image, SafeAreaView, TouchableOpacity , ToastAndroid } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '@/components/loading';
import { s, vs } from 'react-native-size-matters';
import { Raleway_500Medium, useFonts } from '@expo-google-fonts/raleway';
import { router, useLocalSearchParams } from 'expo-router';
import useMediaStore from '@/store/queue';
import { PlaylistStorage } from '@/types/playlist';
import { getPlaylistDetails , deleteSongFromPlaylist } from '@/lib/storage';
import ContextMenu from '@/components/contextMenu';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const PlaylistScreen = () => {
  const { storedPlaylist } = useLocalSearchParams<{ storedPlaylist: string }>();
  const [fontsLoaded] = useFonts({ Raleway_500Medium });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playlist, setPlaylists] = useState<PlaylistStorage>();

  useEffect(() => {
    const loadPlaylist = async() => {
      const playlist = await getPlaylistDetails(storedPlaylist);
      console.log("Playlist :: " , playlist)
      setPlaylists(playlist);
      setIsLoading(false);
    };
    loadPlaylist();
  }, [storedPlaylist]);


  const {addTrack}  = useMediaStore()
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  if (isLoading || !playlist || !fontsLoaded) return <Loading />
  const imageLink = useMemo(() => {
    if (!playlist?.artwork) return '';
    return playlist.artwork.replace(/-(\d{3})x(\d{3})(?=\.\w+($|\?))/, "-500x500");
  }, [playlist?.artwork]);

  const playAllSongs = useCallback(() => {
    console.log('Playing all songs...');
  }, [playlist?.songs]);
  
  const handleContextMenu = useCallback(async (value: any, songId: string) => {
    if (value === 1) {
      await addTrack(songId, "playNext");
      ToastAndroid.show("Playing Next", ToastAndroid.SHORT);
    }
    if (value === 2) {
      await addTrack(songId, "addToQueue");
      ToastAndroid.show("Added to Queue", ToastAndroid.SHORT);
    }
    if (value === 3 && selectedSongId) {
      console.log('Deleting song from playlist:', selectedSongId);
      await deleteSongFromPlaylist(storedPlaylist, selectedSongId);
      setPlaylists((prev) => {
        if (prev?.songs.length) {
          return {
            ...prev,
            songs: prev.songs.filter((s) => s.songId !== selectedSongId),
          };
        }
        return prev;
      });
    }
  }, [selectedSongId, storedPlaylist, addTrack]);
  
  const onLongPressSong = useCallback((songId: string) => {
    setSelectedSongId(songId);
    setContextMenuVisible(true);
  }, []);
  
  



  



  const renderHeader = () => (
    <View style={styles.albumHeader}>
      <LinearGradient
        colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
        style={styles.gradient}
      />
      <Text style={styles.playlistHeader}>PlayList</Text>

      {!imageLink.startsWith("http")?<Image source={require('../../../assets/images/placeholder.jpg')} style={styles.albumCover} /> :<Image source={{ uri: imageLink }} style={styles.albumCover} />}
      <Text style={styles.albumTitle}>{playlist.name}</Text>
      <Text style={styles.songCount}>{`${playlist.songs.length} Songs`}</Text>

      <TouchableOpacity style={styles.playAllButton} onPress={playAllSongs}>
        <Text style={styles.playAllText}>Play All</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={playlist.songs}
          keyExtractor={(item) => item.songId}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <View >

            <TouchableOpacity style={styles.songItem} 
            onPress={()=>router.push(`/music/${item.songId}`)} 
            onLongPress={() => onLongPressSong(item.songId)}
            >

            <View style={{ flex: 1 }}>
              <Text style={styles.songTitle}>{item.title}</Text>
              <Text style={styles.artists} numberOfLines={1}>{item.artist}</Text>
              <Text style={styles.songDuration}>
                {//@ts-ignore
                `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}`}
              </Text>
            </View>
            </TouchableOpacity>            
          </View>
          )}
        />

    <ContextMenu
          isVisible={contextMenuVisible}
          onClose={() => setContextMenuVisible(false)}
          deleteSong={true}

          onPlayNext={() => {
            if (selectedSongId) {
              handleContextMenu(1, selectedSongId);
            }
            setContextMenuVisible(false);
          }}
          onAddQueue={() => {
            if (selectedSongId) {
              handleContextMenu(2, selectedSongId);
            }
            setContextMenuVisible(false);
          }}
          deleteSongFunc={() => {
            if (selectedSongId) {
              handleContextMenu(3, selectedSongId);
            }
            setContextMenuVisible(false);
          }}
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
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '30%',
  },
  playlistHeader: {
    fontFamily: "Raleway_500Medium",
    fontSize: vs(15),
    marginTop: vs(10),
    marginBottom: vs(14),
    color: 'white',
  },
  albumHeader: {
    alignItems: 'center',
    paddingVertical: vs(20),
  },
  albumCover: {
    width: vs(150),
    height: vs(150),
    borderRadius: vs(10),
  },
  albumTitle: {
    fontFamily: 'Raleway_500Medium',
    color: 'white',
    fontSize: vs(12),
    marginTop: vs(10),
    textAlign: 'center',
  },
  artistName: {
    fontFamily: 'Raleway_500Medium',
    color: '#bbb',
    fontSize: vs(10),
    marginBottom: vs(5),
    alignSelf:'center' ,
    textAlign:'center'
  },
  songCount: {
    fontFamily: 'Raleway_500Medium',
    color: '#888',
    fontSize: vs(8),
    marginBottom: vs(15),
  },
  playAllButton: {
    backgroundColor: '#0A84FF',
    borderRadius: vs(5),
    paddingHorizontal: s(15),
    paddingVertical: vs(5),
    marginBottom: vs(10),
  },
  playAllText: {
    fontFamily: 'Raleway_500Medium',
    color: 'white',
    fontSize: vs(10),
  },
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  songImage:{
    width:s(50),
    height:vs(50) ,
    borderRadius:vs(25) ,
    marginRight:s(20)
  } ,
  songTitle: {
    fontFamily: 'Raleway_500Medium',
    color: 'white',
    fontSize: vs(10),
  },
  songDuration: {
    fontFamily: 'Raleway_500Medium',
    color: '#888',
    fontSize: vs(8),
  },
  artists: {
    fontFamily: 'Raleway_500Medium',
    color: '#696969',
    fontSize: vs(8),
  }
});

export default PlaylistScreen;
