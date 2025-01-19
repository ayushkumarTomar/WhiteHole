import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, Pressable, ActivityIndicator, ToastAndroid } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { vs, s } from 'react-native-size-matters';
import { Raleway_500Medium, useFonts } from '@expo-google-fonts/raleway';
import { router, useLocalSearchParams } from 'expo-router';
import { getSongDetails } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/loading';
import { parseTrackPlayer, parseString } from '@/lib/mediaProcess';
import useMediaStore from '@/store/queue';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import AntDesign from '@expo/vector-icons/AntDesign';
import Slider from '@react-native-assets/slider';
import { checkFavourite, downloadSong, removeFavourite, saveFavourite } from '@/lib/storage';
import ContextMenu from '@/components/contextMenu';
import { SongCollection } from '@/types/songs';

const MusicPlayerScreen = () => {
  const { musicId } = useLocalSearchParams<{ musicId: string }>();
  const { position, duration } = useProgress()
  const { currentTrack, setPlayback, isPlaying, isBuffering, addTrack, downloadProgress, setDownloadProgress } = useMediaStore()
  const [isFavorite, setIsFavorite] = useState(false)
  const [fontsLoaded] = useFonts({ Raleway_500Medium })
  const [contextMenuVisible, setContextMenuVisible] = useState(false)

  const { data: songData, isLoading } = useQuery<SongCollection>({
    queryKey: ['songDetails', musicId],
    queryFn: () => getSongDetails(musicId!),
    enabled: !!musicId,
  });

  const currentSong = useMemo(() => songData?.[musicId], [songData, musicId])
  const imageLink = useMemo(() => currentSong?.image?.replace(/-(\d{3})x(\d{3})(?=\.\w+($|\?))/, "-500x500"), [currentSong])
  const releaseDate = currentSong?.release_date

  const handleSeek = async (value: number) => TrackPlayer.seekTo(value)
  const playSong = useCallback(async () => musicId && addTrack(musicId, "playNow"), [musicId, addTrack])
  const togglePlayPause = async () => setPlayback(!isPlaying)

  const toggleFavorite = useCallback(async () => {
    if (!musicId || !currentSong) return;
    isFavorite ? removeFavourite(musicId) : saveFavourite(parseTrackPlayer(currentSong))
    setIsFavorite(!isFavorite)
  }, [musicId, currentSong, isFavorite])

  useEffect(() => {
    const checkFav = async () => musicId && setIsFavorite(!!await checkFavourite(musicId))
    checkFav()
  }, [musicId])

  useEffect(() => {
    if (musicId && currentSong && currentTrack?.songId !== musicId) playSong()
  }, [musicId, currentSong, currentTrack?.songId, playSong])

  const downloadFunc = useCallback(async () => {
    ToastAndroid.show("Downloading", ToastAndroid.SHORT)
    if (currentTrack?.url && currentTrack.title) {
      const success = await downloadSong(currentTrack)
      ToastAndroid.show(success ? "Downloaded" : "Failed", success ? ToastAndroid.LONG : ToastAndroid.SHORT)
      success && setDownloadProgress(0)
    }
  }, [currentTrack]);

  if (isLoading || !fontsLoaded || !currentSong) return <Loading />

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AntDesign name="down" size={24} color="white" style={styles.iconContainer} onPress={router.back} />
        <View style={styles.downloadContainer}>
          <AntDesign name="clouddownloado" size={24} color="white" onPress={downloadFunc} />
          {downloadProgress > 0 && <Text style={styles.progressText}>{downloadProgress.toFixed(0)}%</Text>}
        </View>

        <LinearGradient colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']} style={styles.gradient} />

        <Text style={styles.playlistHeader}>{parseString(currentSong.album) || "Song"}</Text>

        <View style={styles.songInfo}>
          <Image source={{ uri: imageLink }} style={styles.albumCover} />
          <Text style={styles.songTitle}>{parseString(currentSong.song)}</Text>
          <Text style={styles.artistName}>{parseString(currentSong.primary_artists)}</Text>
          <Text style={styles.artistName}>{releaseDate}</Text>
        </View>

        <View style={styles.seekBarContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {Math.floor(position / 60)}:{(position % 60).toFixed(0).padStart(2, '0')}
            </Text>
            <Text style={styles.timeText}>
              {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}
            </Text>
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
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={s(24)} color={isFavorite ? "red" : "white"} />
          </TouchableOpacity>
          <Ionicons name="play-skip-back-outline" size={s(30)} color="white"onPress={() => TrackPlayer.skipToPrevious()} />
          <Pressable onPress={togglePlayPause} style={styles.playPauseButton}>
            {isBuffering ? <ActivityIndicator size={s(40)} /> : <Ionicons name={isPlaying ? "pause" : "play"} size={s(40)} color="white" />}
          </Pressable>
          <Ionicons name="play-skip-forward-outline" size={s(30)} color="white" onPress={()=>TrackPlayer.skipToNext()} />
          <Ionicons name="ellipsis-horizontal-outline" size={s(24)} color="white" onPress={() => setContextMenuVisible(true)} />
        </View>

        <ContextMenu
          isVisible={contextMenuVisible}
          onClose={() => setContextMenuVisible(false)}
          shorterContextMenu
          onPlaylist={() => musicId && router.push({ pathname: `/(pages)/playlist/addToPlayList`, params: { songId: musicId } })}
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
    alignItems: 'center',
  },
  progressText: {
    color: 'white',
    fontSize: vs(10),
  },
  gradient: StyleSheet.absoluteFillObject,
  playlistHeader: {
    fontFamily: "Raleway_500Medium",
    fontSize: vs(20),
    marginVertical: vs(14),
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
  },
  artistName: {
    fontFamily: 'Raleway_500Medium',
    color: '#bbb',
    fontSize: vs(12),
  },
  seekBarContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: vs(20),
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  playPauseButton: {
    backgroundColor: '#1DB954',
    borderRadius: vs(30),
    padding: vs(10),
  },
});

export default MusicPlayerScreen;