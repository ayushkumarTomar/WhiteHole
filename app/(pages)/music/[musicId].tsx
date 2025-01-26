import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, Pressable, ActivityIndicator, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { vs, s } from 'react-native-size-matters';
import { Raleway_500Medium, useFonts } from '@expo-google-fonts/raleway';
import { router, useLocalSearchParams } from 'expo-router';
import { getSongDetails } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/loading';
import { parseTrackPlayer, parseString, Track } from '@/lib/mediaProcess';
import useMediaStore from '@/store/queue';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import AntDesign from '@expo/vector-icons/AntDesign';
import Slider from '@react-native-assets/slider';
import { checkFavourite, downloadSong, removeFavourite, saveFavourite } from '@/lib/storage';
import ContextMenu from '@/components/contextMenu';
import { SongCollection } from '@/types/songs';

const MusicPlayerScreen = () => {
  const { musicId } = useLocalSearchParams<{ musicId: string }>();
  const { position, duration } = useProgress();

  const handleSeek = async (value: number) => { // Fixed type to number
    await TrackPlayer.seekTo(value);
  };

  const { currentTrack, setPlayback, isPlaying, isBuffering, addTrack , downloadProgress , setDownloadProgress } = useMediaStore();

  const [isFavorite, setIsFavorite] = useState(false);
  const [fontsLoaded] = useFonts({ Raleway_500Medium });
  const { data: songData, isLoading } = useQuery<SongCollection>({
    queryKey: ['songDetails', musicId],
    queryFn: () => getSongDetails(musicId!),
    enabled: !!musicId, 
  });

  const playSong = useCallback(async () => { 
    if (musicId) {
      await addTrack(musicId, "playNow");
    }
  }, [musicId, addTrack]);

  const togglePlayPause = async () => {
    setPlayback(!isPlaying);
  };

  const toggleFavorite = async () => {
    if (!musicId) return; 
    if (isFavorite) {
      removeFavourite(musicId);
      setIsFavorite(false);
    } else {
      if (songData?.[musicId]) {
        saveFavourite(parseTrackPlayer(songData[musicId]));
        setIsFavorite(true);
      }
    }
  };

  const checkIsFavourite = useCallback(async () => { // Memoize function
    if (!musicId) return;
    const isFav = await checkFavourite(musicId);
    setIsFavorite(!!isFav);
  }, [musicId]);

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  useEffect(() => {
    checkIsFavourite();
  }, [checkIsFavourite]); 

  useEffect(() => {
    if (musicId && songData?.[musicId] && currentTrack?.songId !== musicId) {
      playSong();
    }
  }, [musicId, songData, currentTrack?.songId, playSong]);

  if (isLoading || !songData || !fontsLoaded || !musicId) return <Loading />;

  const currentSong = songData[musicId];
  if (!currentSong) return <Loading />;

  const imageLink50 = currentSong.image;
  const imageLink = imageLink50.replace(/-(\d{3})x(\d{3})(?=\.\w+($|\?))/, "-500x500");
  const releaseDate = currentSong.release_date;


  const goPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const goNext = async () => {
    await TrackPlayer.skipToNext();
  };

  const handleContextMenu = async()=>{
      if(musicId) {
        router.push({pathname:`/(pages)/playlist/addToPlayList` , params:{songId:musicId}})
      } 
  }

  const downloadFunc = async()=>{
    ToastAndroid.show("Downloading" , ToastAndroid.SHORT)
    if(currentTrack?.url && currentTrack.title) {
      const download = await downloadSong(currentTrack)
      if(download) {ToastAndroid.show("Downloaded " , ToastAndroid.LONG);setDownloadProgress(0)}
      else  ToastAndroid.show("Failed" , ToastAndroid.SHORT)

    }

    else{
      ToastAndroid.show("Failed" , ToastAndroid.SHORT)

    }
  }

 


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer} onTouchEnd={()=>router.back()}>
        <AntDesign name="down" size={24} color="white" />
      </View>    
      <View style={styles.downloadContainer} onTouchEnd={downloadFunc}>
        <AntDesign name="clouddownloado" size={24} color="white" />
       {downloadProgress>0 &&  <Text style={{color:'white'}}>{downloadProgress.toFixed(0)} %</Text>}

      </View>     
        <LinearGradient
          colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
          style={styles.gradient}
        />

        <Text style={styles.playlistHeader}>{parseString(songData[musicId].album) || "Song"}</Text>

        {/* Song Info */}
        <View style={styles.songInfo}>
          <Image source={{ uri: imageLink }} style={styles.albumCover} />
          <Text style={styles.songTitle}>{parseString(songData[musicId].song)}</Text>
          <Text style={styles.artistName}>{parseString(songData[musicId].primary_artists)}</Text>
          <Text style={styles.artistName}>{releaseDate}</Text>
        </View>

        {/* Seek Bar */}
        <View style={styles.seekBarContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{Math.floor(position / 60)}:{(position % 60).toFixed(0).padStart(2, '0')}</Text>
            <Text style={styles.timeText}>{Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}</Text>
          </View>
          <Slider
            value={position}
            minimumValue={0}
            maximumValue={duration}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#444"
            thumbTintColor="#1DB954"
            style={styles.slider}
          />
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={s(24)}
              color={isFavorite ? "red" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={goPrevious}>
            <Ionicons name="play-skip-back-outline" size={s(30)} color="white" />
          </TouchableOpacity>
          <Pressable onPress={togglePlayPause} style={styles.playPauseButton}>
            {isBuffering ? (
              <ActivityIndicator size={s(40)}/>
            ) : (
              <Ionicons name={isPlaying ? "pause" : "play"} size={s(40)} color="white" />
            )}
          </Pressable>
          <TouchableOpacity onPress={goNext}>
            <Ionicons name="play-skip-forward-outline" size={s(30)} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setContextMenuVisible(true); setSelectedSongId(musicId)}}>
            <Ionicons name="ellipsis-horizontal-outline" size={s(24)} color="white" />
          </TouchableOpacity>
        </View>


        <ContextMenu
          isVisible={contextMenuVisible}
          onClose={() => setContextMenuVisible(false)}
          shorterContextMenu={true}
          onPlaylist={() => {
            if (selectedSongId) {
              handleContextMenu();
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
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'absolute',
    top: vs(40),
    left: vs(15),
    zIndex: 1,
  },
  downloadContainer: {
    position: 'absolute',
    top: vs(40),
    right: vs(15),
    zIndex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  playlistHeader: {
    fontFamily: "Raleway_500Medium",
    fontSize: vs(20),
    marginVertical: vs(14),
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
  },
  songInfo: {
    alignItems: 'center',
    marginVertical: vs(30),
  },
  albumCover: {
    width: vs(200),
    height: vs(200),
    borderRadius: vs(10),
  },
  songTitle: {
    fontFamily: 'Raleway_500Medium',
    color: 'white',
    fontSize: vs(16),
    marginTop: vs(10),
    textAlign: 'center',
  },
  artistName: {
    fontFamily: 'Raleway_500Medium',
    color: '#bbb',
    fontSize: vs(12),
    textAlign: 'center',
  },
  seekBarContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: vs(20),
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(10),
    marginBottom: vs(5),
  },
  timeText: {
    color: '#aaa',
    fontSize: vs(10),
  },
  slider: {
    height: vs(10),
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: vs(30),
    paddingHorizontal: s(20),
  },
  playPauseButton: {
    backgroundColor: '#1DB954',
    borderRadius: vs(30),
    padding: vs(10),
  },
});

export default MusicPlayerScreen;
