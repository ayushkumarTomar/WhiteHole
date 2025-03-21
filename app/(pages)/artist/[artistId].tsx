import { View, Text, FlatList, StyleSheet, Image, SafeAreaView, TouchableOpacity , ToastAndroid, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { getArtistDetails } from '@/lib/api';
import Loading from '@/components/loading';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { Raleway_500Medium, useFonts } from '@expo-google-fonts/raleway';
import { router, useLocalSearchParams } from 'expo-router';
import { parseString } from '@/lib/mediaProcess';
import useMediaStore from '@/store/queue';
import ContextMenu from '@/components/contextMenu';
import { ArtistTopSong } from '@/types/artists';
import useLazyLoad from '@/hooks/useLazyLoad';

const ArtistScreen = () => {
  const { artistId } = useLocalSearchParams<{ artistId: string }>();
  const [fontsLoaded] = useFonts({ Raleway_500Medium });

  const { data: artistDetails, isLoading } = useQuery({
    queryKey: ['artistDetails', artistId],
    queryFn: () => getArtistDetails(artistId),
  });

  const {addTrack}  = useMediaStore()
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const { data:visibleSongs , hasMore , loadMore , isLoading : isSongsLoading } = useLazyLoad(artistDetails?.topSongs || [] , 10) 


  const imageLink = useMemo(() => {
      if (!artistDetails?.image) return '';
      return artistDetails.image.replace(/-(\d{3})x(\d{3})(?=\.\w+($|\?))/, "-500x500").replace("_50x50" , "_500x500").replace("_150x150" , "_500x500");
    }, [artistDetails?.image]);
  const visibleSongsRef = useRef(visibleSongs);
    useEffect(() => {
      visibleSongsRef.current = visibleSongs;
    }, [visibleSongs]);
  
    const playAllSongs = () => {
      console.log("visibleSongs (ref):", visibleSongsRef.current);
      ToastAndroid.show('Playing all songs...', ToastAndroid.SHORT);

      if (visibleSongsRef.current.length > 0) {
        Promise.all(
          visibleSongsRef.current.map(async (song) => {
            console.log("Adding to queue:", song.id);
            await addTrack(song.id, "addToQueue");
          })
        ).then(() => {
        });
      } else {
        ToastAndroid.show('No songs to play', ToastAndroid.SHORT);
      }
    };
 

   const handleContextMenu = useCallback(
      async (value: any, songId: string) => {
        if (value === 1) {
          await addTrack(songId, "playNext");
          ToastAndroid.show("Playing Next", ToastAndroid.SHORT);
        }
        if (value === 2) {
          await addTrack(songId, "addToQueue");
          ToastAndroid.show("Added to Queue", ToastAndroid.SHORT);
        }
        if (value === 3 && selectedSongId) {
          router.push({ pathname: `/(pages)/playlist/addToPlayList`, params: { songId: selectedSongId } });
        }
      },
      [addTrack, router, selectedSongId]
    );
    
    const onLongPressSong = useCallback((songId: string) => {
      setSelectedSongId(songId);
      setContextMenuVisible(true);
    }, []);


  const getArtistNames = (songData:ArtistTopSong)=>{
    let artistString = ""
    songData.more_info.artistMap.artists.map((element)=>artistString+=element.name)

    return artistString;
  }

  

  if (isLoading || !artistDetails || !fontsLoaded) return <Loading />




  const renderHeader = () => (
    <View style={styles.albumHeader}>
      <LinearGradient
        colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
        style={styles.gradient}
      />
      <Text style={styles.playlistHeader}>Artist</Text>

      {!imageLink.startsWith("http")?<Image source={require('../../../assets/images/placeholder.jpg')} style={styles.albumCover} /> :<Image source={{ uri: imageLink }} style={styles.albumCover} />}
      <Text style={styles.albumTitle}>{artistDetails?.name}</Text>
      <Text style={styles.artistName}>{artistDetails.dominantLanguage.charAt(0).toUpperCase()+artistDetails.dominantLanguage.slice(1)}</Text>
      <Text style={styles.songCount}>{artistDetails.subtitle}</Text>

      <TouchableOpacity style={styles.playAllButton} onPress={playAllSongs}>
        <Text style={styles.playAllText}>Play All</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={visibleSongs}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <View >

            <TouchableOpacity style={styles.songItem} 
            onPress={()=>router.push(`/music/${item.id}`)} 
            onLongPress={() => onLongPressSong(item.id)}
            >

            <View style={{ flex: 1 }}>
              <Text style={styles.songTitle}>{parseString(item.title)}</Text>
              <Text style={styles.artists} numberOfLines={1}>{getArtistNames(item)}</Text>
              <Text style={styles.songDuration}>
                {`${Math.floor(parseInt(item.more_info.duration) / 60)}:${(parseInt(item.more_info.duration) % 60).toString().padStart(2, '0')}`}
              </Text>
            </View>
            </TouchableOpacity>
            
          </View>
          )}

           onEndReached={hasMore ? loadMore : null}
          onEndReachedThreshold={0.9}
          ListFooterComponent={
            isSongsLoading ? <ActivityIndicator style={{marginVertical:vs(10)}} size="large" color="#fff" /> : null
          }
        />

    <ContextMenu
          isVisible={contextMenuVisible}
          onClose={() => setContextMenuVisible(false)}
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
          onPlaylist={() => {
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
  },
  menuButtonText: {
    fontSize: vs(14),
    color: 'white',
  },
  menuOptions: {
    backgroundColor: 'transparent', 
    padding: vs(10),
    elevation:10 ,
    
    borderRadius: vs(5),
    
  },
  menuOption: {
    fontFamily: 'Raleway_500Medium',
    color:'white'  },
});

export default ArtistScreen;
