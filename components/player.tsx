import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useMediaStore from '@/store/queue';
import { s, vs } from 'react-native-size-matters';
import TrackPlayer from 'react-native-track-player';
import { checkFavourite, removeFavourite, saveFavourite } from '@/lib/storage';


const Player = () => {
  const {isPlaying , setPlayback , currentTrack , setQueue , isBuffering} = useMediaStore()
  const [position, setPosition] = useState(0); 
  const [isDragging, setIsDragging] = useState(false); 

  const [isFavourite, setIsFavourite] = useState(false)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        return gestureState.dy > 0; 
      },
      onPanResponderMove: (e, gestureState) => {
        // console.log("GEsutre state ::> " , gestureState.dy)
        if (gestureState.dy > 0) {
          setPosition(gestureState.dy); 
          setIsDragging(true); 
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 10) {
          setPlayback(false); 
          
        }
        setPosition(0);
        setIsDragging(false);
      },
    })
  ).current;

  const router = useRouter();

  const handlePlayerClick = () => {
    if (!isDragging) { 
      router.push(`/queue`);
    }
  };
  const handleSkip = async()=>{
    const len = (await TrackPlayer.getQueue()).length
    const active = await TrackPlayer.getActiveTrackIndex()
    if(len-1 == active){
      TrackPlayer.reset()
      setPlayback(false)
      setQueue([])
    }
    else{
      TrackPlayer.skipToNext()
    }
  }


  const checkIsFavourite = async()=>{
    if(currentTrack){
      const isFav = await checkFavourite(currentTrack.songId);
      console.log("is fav returned :: " , isFav)
      setIsFavourite(isFav)

    }
  }

   const toggleFavorite = async()=>{
    if(!currentTrack) return;
  
      if(isFavourite){

        console.log("Removing favourite")


        removeFavourite(currentTrack.songId);
        setIsFavourite(false);
      }
      else{
       
        saveFavourite(currentTrack);
        setIsFavourite(true);
      }
    }

  useEffect(() => {
    console.log("checking favoruite")
    checkIsFavourite()
    
  } , [currentTrack])
  if (currentTrack) {
    return (
      <View
        style={[styles.container, { transform: [{ translateY: position }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.player} onTouchEnd={handlePlayerClick}>
          {currentTrack?.artwork && <Image source={{ uri: currentTrack.artwork }} style={styles.image} />}
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{currentTrack?.title}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subtitle}>{currentTrack?.artist}</Text>
          </View>
          <View style={{flexDirection:'row' , gap:vs(2)}} onTouchEnd={(e)=>e.stopPropagation()}>
          <Ionicons
            name="heart"
            size={22}
            onPress={toggleFavorite}
            color={isFavourite ? 'red' : 'white'}
            style={{ marginHorizontal: 10 }}

          />
          <Ionicons
            name={isBuffering? 'pause' : isPlaying ? 'pause' : 'play'}
            size={22}
            onPress={()=>{console.log("clicked pause");setPlayback(!isPlaying)}}
            color={currentTrack?.artwork ? 'white' : 'gray'}
            style={{ marginHorizontal: 10 }}

          />

        <Ionicons
            name={'play-skip-forward'}
            size={20}
            color={'white'}
            onPress={handleSkip}
          />
          </View>
        </View>
      </View>
    );
  } else {
    return null; 
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    top: vs(-95),
    height: vs(60),
    padding: vs(10),
    borderRadius:vs(20)
  },
  player: {
    backgroundColor: '#286660',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: s(5),
    padding: s(3),
    paddingRight: s(15),
  },
  title: {
    color: 'white',
  },
  subtitle: {
    color: 'lightgray',
    fontSize: 12,
  },
  image: {
    height: '100%',
    aspectRatio: 1,
    marginRight: s(10),
    borderRadius: s(5),
  },
});

export default Player;
