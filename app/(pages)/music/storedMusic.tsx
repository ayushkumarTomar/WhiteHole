import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { vs, s } from 'react-native-size-matters';
import { Raleway_500Medium, useFonts } from '@expo-google-fonts/raleway';
import { router, useLocalSearchParams } from 'expo-router';
import Loading from '@/components/loading';
import { Track } from '@/lib/mediaProcess';
import useMediaStore from '@/store/queue';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import AntDesign from '@expo/vector-icons/AntDesign';
import Slider from '@react-native-assets/slider';
import { getDownloadMetaData, getSongUri } from '@/lib/storage';
import Feather from '@expo/vector-icons/Feather';

const MusicPlayerScreen = () => {
  const { musicId } = useLocalSearchParams<{ musicId: string }>();
  const { position, duration } = useProgress();

  const handleSeek = async (value: number) => { // Fixed type to number
    await TrackPlayer.seekTo(value);
  };

  const { currentTrack, setPlayback, isPlaying, isBuffering, addTrack } = useMediaStore();

  const [fontsLoaded] = useFonts({ Raleway_500Medium });
  const [isLoading , setIsLoading] = useState<boolean>(true)

  const [songData , setSongData] = useState<Track>()
  useEffect(()=>{
    const getSongData = async()=>{
        const songData = await getDownloadMetaData(musicId)
        const fileUri = await getSongUri(musicId)
        if(!songData || !fileUri) return;
        songData.url = fileUri
        console.log('song Data :: ' , songData)
        setSongData(songData)
        setIsLoading(false)
    }
    getSongData();
    
  } , [])
  const playSong = useCallback(async () => { 
    if (musicId && songData) {
        console.log("Calling playnow")
      await addTrack(musicId, "playNow" , true , songData)
    }
  }, [musicId , songData]);

  const togglePlayPause = async () => {
    setPlayback(!isPlaying);
  };

  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  
  useEffect(() => {
    if (musicId && songData && currentTrack?.songId !== musicId) {
        console.log("playing song")
      playSong();
    }
  }, [musicId, songData, currentTrack?.songId, playSong]);

  if (isLoading || !songData || !fontsLoaded || !musicId) return <Loading />;

  const goPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const goNext = async () => {
    await TrackPlayer.skipToNext();
  };


  
 


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer} onTouchEnd={()=>router.back()}>
        <AntDesign name="down" size={vs(20)} color="white" />
      </View>    
       <LinearGradient
          colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
          style={styles.gradient}
        />

        <Text style={styles.playlistHeader}>{songData.album}</Text>

        {/* Song Info */}
        <View style={styles.songInfo}>
          <View style={styles.albumCover}>
          <Feather name="music" size={vs(100)} color="white" style={{marginRight:vs(20)}} />
            </View>
          <Text style={styles.songTitle}>{songData.title}</Text>
          <Text style={styles.artistName}>{songData.artists}</Text>
          <Text style={styles.artistName}>{songData.date}</Text>
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
          
        </View>


        
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
    backgroundColor:"#bbb",
    justifyContent:'center' ,
    alignItems:'center'
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
