import { View, Text, FlatList, StyleSheet, Image, SafeAreaView, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { getAlbumDetails } from '@/lib/api';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { Raleway_500Medium, useFonts } from '@expo-google-fonts/raleway';
import { router, useLocalSearchParams } from 'expo-router';
import Loading from '@/components/loading';
import { parseString } from '@/lib/mediaProcess';
import useMediaStore from '@/store/queue';
import ContextMenu from '@/components/contextMenu';
import useLazyLoad from '@/hooks/useLazyLoad';

const AlbumScreen = () => {
  const { albumId } = useLocalSearchParams<{ albumId: string }>();
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [fontsLoaded] = useFonts({ Raleway_500Medium });

  const { data: albumData, isLoading } = useQuery({
    queryKey: ['albumDetails', albumId],
    queryFn: () => getAlbumDetails(albumId),
  });

  const { addTrack } = useMediaStore()

  const imageLink = useMemo(() => {
    if (!albumData?.image) return '';
    return albumData.image.replace(/-(\d{3})x(\d{3})(?=\.\w+($|\?))/, "-500x500");
  }, [albumData?.image]);




  const { data: visibleSongs, hasMore, loadMore, isLoading: isSongsLoading } = useLazyLoad(albumData?.songs || [], 10)
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


  const renderHeader = useMemo(() => (
    <View style={styles.albumHeader}>
      <LinearGradient
        colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
        style={styles.gradient}
      />
      <Text style={styles.playlistHeader}>Album</Text>
      <Image source={{ uri: imageLink }} style={styles.albumCover} />
      <Text style={styles.albumTitle}>{albumData?.title}</Text>
      <Text style={styles.artistName}>{albumData?.primary_artists}</Text>
      <Text style={styles.songCount}>{`${albumData?.songs.length} Songs`}</Text>

      <TouchableOpacity style={styles.playAllButton} onPress={playAllSongs}>
        <Text style={styles.playAllText}>Play All</Text>
      </TouchableOpacity>
    </View>
  ), [albumData, imageLink]);

  if (isLoading || !albumData || !fontsLoaded) return <Loading />



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
                onPress={() => router.push(`/music/${item.id}`)}
                onLongPress={() => onLongPressSong(item.id)}
              >

                <View style={{ flex: 1 }}>
                  <Text style={styles.songTitle}>{parseString(item.song)}</Text>
                  <Text style={styles.artists} numberOfLines={1}>{item.primary_artists}</Text>
                  <Text style={styles.songDuration}>
                    {`${Math.floor(parseInt(item.duration) / 60)}:${(parseInt(item.duration) % 60).toString().padStart(2, '0')}`}
                  </Text>
                </View>

              </TouchableOpacity>

            </View>

          )}
          onEndReached={hasMore ? loadMore : null}
          onEndReachedThreshold={0.9}
          ListFooterComponent={
            isSongsLoading ? <ActivityIndicator style={{ marginVertical: vs(10) }} size="large" color="#fff" /> : null
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
    alignSelf: 'center',
    textAlign: 'center'
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
});

export default AlbumScreen;
