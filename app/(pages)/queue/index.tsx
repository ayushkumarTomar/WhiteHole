import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { Raleway_500Medium, useFonts } from '@expo-google-fonts/raleway';
import { Link } from 'expo-router';
import Loading from '@/components/loading';
import useMediaStore from '@/store/queue';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import LoaderKit from 'react-native-loader-kit'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Swipeable } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const Queue = () => {
  const [fontsLoaded] = useFonts({ Raleway_500Medium });

  const { queue, setQueue, currentTrack, isPlaying, resetPlayer , removeTrack } = useMediaStore()

  if (!queue || !fontsLoaded) return <Loading />

  const renderHeader = () => (
    <View>
      <Text style={styles.playlistHeader}>Queue</Text>
      <Text style={{position:'absolute' , right:vs(10) , top:vs(35) , color:'white' , fontFamily:"Raleway_500Medium"}} onPress={resetPlayer}> Clear All</Text>
    
    </View>
  );
  const onDelete = (songId : string)=>{
    removeTrack(songId)
    

  }

  const leftSwipe = (songId:string) => (
    <View style={styles.leftSwipeContainer}>
      <TouchableOpacity onPress={() => onDelete(songId)}>
        <AntDesign name="delete" size={s(24)} color="white" />
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


        <DraggableFlatList
          data={queue}
          keyExtractor={(item) => item.songId}
          ListHeaderComponent={renderHeader}
          onDragBegin={() => console.log("DRAG STARTED")}
          onDragEnd={({ data }) => { console.log("Drag started"); setQueue(data) }} // Update the queue state on drag end
          stickyHeaderHiddenOnScroll={true}
          renderItem={({ item, drag, isActive }) => (
            <Swipeable renderLeftActions={()=>leftSwipe(item.songId)} renderRightActions={()=>null}> 
            <ScaleDecorator>
              <Link href={{
                pathname: '/music/[musicId]',
                params: { musicId: item.songId }
              }} asChild>
                <TouchableOpacity
                  onLongPress={drag} // Start dragging on long press
                  disabled={isActive}
                  style={styles.songItem} >

                  <Image source={{ uri: item.artwork }} style={[styles.songImage, { opacity: currentTrack?.songId === item.songId ? 0.3 : 1 }]} />
                  {currentTrack?.songId === item.songId &&
                    isPlaying ?
                    <LoaderKit
                      style={styles.trackPlayingIconIndicator}
                      name="LineScaleParty"
                      color={"#fff"}
                    /> : currentTrack?.songId === item.songId && <FontAwesome name="play" size={vs(10)} color="#fff" style={styles.trackPlayingIconIndicator} />}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.songTitle}>{item.title}</Text>
                    <Text style={styles.artists} numberOfLines={1}>{item.artist}</Text>
                  </View>
                  <Text style={styles.songDuration}>
                    {item.duration && `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}`}


                  </Text>
                </TouchableOpacity>
              </Link>

            </ScaleDecorator>
            </Swipeable>


          )}

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
    height: "30%",
  },
  playlistHeader: {
    fontFamily: "Raleway_500Medium",
    fontSize: vs(15),
    marginTop: vs(30),
    marginBottom: vs(14),
    color: 'white',
    alignSelf: 'center',
  },
  trackPlayingIconIndicator: {
    position: 'absolute',
    top: vs(18),
    left: s(27),
    width: s(20),
    height: vs(16),
    textAlign: 'center',
  },
  songImage: {
    width: s(30),
    height: vs(30),
    borderRadius: vs(15),
    marginRight: s(20)
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
  leftSwipeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: vs(20),
  },
});

export default Queue;
