
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import TrendingSearch from '@/components/search';
import { useQuery } from '@tanstack/react-query';
import { getSearchTrending, getTopSearches } from '@/lib/api';
import useDebounce from '@/hooks/useDebounce';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium, useFonts } from "@expo-google-fonts/montserrat"
import SearchResults from '@/components/searchResults';
import Loading from '@/components/loading';

// type searchDataType = {
//   topquery:{} ,
//   artists:{} ,
//   albums:{},
//   shows:{} ,
//   playlists:{}
// }
type searchDataType = {
  topquery: Record<string, any>;
  artists: Record<string, any>;
  albums: Record<string, any>;
  shows: Record<string, any>;
  playlists: Record<string, any>;
  songs: Record<string, any>;

};

const Explore = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    Montserrat_500Medium
  });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  const { data: trendingData, isLoading: isLoadingTrending } = useQuery<any[], Error>({
    queryKey: ['trendingSearches'],
    queryFn: getSearchTrending
  });
  const { data: searchData, isLoading: isLoadingSearchData } = useQuery<searchDataType, Error>({
    queryKey: ['searchAll', debouncedSearchTerm],
      //@ts-ignore
    queryFn: () => getTopSearches(debouncedSearchTerm),
    enabled: debouncedSearchTerm !== "", // Only fetch if there's a search query
  });

  if (!fontsLoaded) return <Loading/>;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
          style={styles.gradient}
        />
        <ScrollView>
          <View style={styles.header}>
            <FontAwesome6 name="headphones-simple" size={24} color="white" />
            <Text style={styles.headerText}>
              Dive into Sound!{"\n"}
              <Text style={[styles.headerText, { fontSize: vs(20) }]}>Discover Your Next Favorite Tune</Text>
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <AntDesign name="search1" size={18} color="#888" style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholder="Search for songs, artists, albums..."
              placeholderTextColor="#888"
            />
          </View>
          {isLoadingSearchData || isLoadingTrending ? <ActivityIndicator size={50} color={'white'} style={{ marginTop: vs(40) }} /> :
            searchQuery === "" ? (
              // Show trending searches if no search query
              <TrendingSearch title="Trending Searches" continueListeningData={trendingData} />
            ) : (
              <>

                {searchData?.topquery.data.length > 0 && <SearchResults title="Top Result" continueListeningData={searchData?.topquery} type="topquery" />}
                {searchData?.songs.data.length > 0 && <SearchResults title="Songs" continueListeningData={searchData?.songs} type="songs" />}
                {searchData?.albums.data.length > 0 && <SearchResults title="Albums" continueListeningData={searchData?.albums} type="albums" />}
                {searchData?.playlists.data.length > 0 && <SearchResults title="Playlists" continueListeningData={searchData?.playlists} type="playlists" />}
                {searchData?.artists.data.length > 0 && <SearchResults title="Artists" continueListeningData={searchData?.artists} type="artists" />}
                {searchData?.shows.data.length > 0 && <SearchResults title="Shows" continueListeningData={searchData?.shows} type="shows" />}
              </>
            )}
          <View style={{ marginBottom: vs(50), flex: 1 }}>

          </View>
        </ScrollView>


      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Styles for the component
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: vs(10),
    marginTop: vs(30),
  },
  headerText: {
    color: "white",
    fontFamily: "Montserrat_700Bold",
    marginLeft: s(10),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: s(20),
    marginHorizontal: s(10),
    marginTop: vs(10),
    paddingVertical: vs(8),
    paddingHorizontal: s(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: s(8),
  },
  searchInput: {
    flex: 1,
    fontSize: vs(14),
    color: '#333',
    fontFamily: "Montserrat_500Medium",
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Explore;
