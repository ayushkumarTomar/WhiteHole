import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '@/components/loading';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ms, s, vs } from 'react-native-size-matters';
import { Raleway_500Medium, useFonts } from '@expo-google-fonts/raleway';
import { getFavourites, removeFavourite } from '@/lib/storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Swipeable } from 'react-native-gesture-handler';
import { Link } from 'expo-router';

interface ListItemProps {
  item: Item;
  onDelete: (songId: string) => void;
}

interface Item {
  artwork?: string;
  title: string;
  songId: string;
  artist: string;
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
      <Link href={{ pathname: '/(pages)/music/[musicId]', params: { musicId: item.songId } }} asChild>
      <TouchableOpacity style={styles.playlistItem}>
        {item.artwork ? (
          <Image source={{ uri: item.artwork }} style={styles.playListCover} />
        ) : (
          <Image source={require('../../../assets/images/placeholder.jpg')} style={styles.playListCover} />
        )}
        <View style={{ flex: 1 , alignItems:'flex-start'}}> 
          <Text style={styles.playlistName}>{item.title}</Text>
          <Text style={styles.artists} numberOfLines={1}>{item.artist}</Text>
        </View>

      </TouchableOpacity>
      </Link>
    </Swipeable>
  );
};

const Favourites = () => {
  const [fontsLoaded] = useFonts({ Raleway_500Medium });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [favourites, setFavourites] = useState<Item[]>([]);

  useEffect(() => {
    const loadFavourites = async () => {
      const favouriteArray = await getFavourites();
      setFavourites(favouriteArray);
      setIsLoading(false);
    };
    loadFavourites();
  }, []);

  if (!fontsLoaded || isLoading) return <Loading />;

  const renderHeader = () => (
    <View style={styles.albumHeader}>
      <Text style={styles.playlistHeader}>Favourites</Text>
    </View>
  );

  const handleDelete = (songId: string) => {
    console.log("delteting", songId)
    setFavourites(prev => prev.filter(song => song.songId !== songId));
    removeFavourite(songId);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
          style={styles.gradient}
        />
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.songId.toString()}
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
    padding: vs(20),
    height: '100%',
  },
  artists: {
    fontFamily: 'Raleway_500Medium',
    fontSize: vs(7),
    color: '#bbb',

  }
});

export default Favourites;
