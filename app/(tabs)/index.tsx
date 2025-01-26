import { View, Text, FlatList, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { Montserrat_700Bold, useFonts, Montserrat_600SemiBold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import songs from "@/assets/data/songs";
import ContinueChart from '@/components/continue';
import TrendingChart from '@/components/charts';
import { useQuery } from '@tanstack/react-query';
import { getModules } from '@/lib/api';
import PlayList from '@/components/search';
import Loading from '@/components/loading';
import { getLastSession } from '@/lib/storage';
import { launchData } from '@/types/launchData';
import { Track } from 'react-native-track-player';

const Home = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    Montserrat_500Medium,
  });

  const [continueListeningData, setContinueListeningData] = useState<Track[]>([]);
  const { data, error, isLoading } = useQuery<launchData, Error>({
    queryKey: ['modules'],
    queryFn: getModules,
  });

  useEffect(() => {
    const fetchLastSession = async () => {
      setContinueListeningData(await getLastSession());
    };
    fetchLastSession();
  }, []);

  if (isLoading || !fontsLoaded || !data) return <Loading />;
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Error: {error.message}</Text>
      </View>
    );
  }

  const { new_trending, top_playlists, new_albums, browse_discover, charts, radio } = data;
  console.log("Data keys:", Object.keys(data));

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[
            'rgba(14, 14, 14, 0.00)', // Transparent black
            'rgba(16, 43, 45, 0.94)', // Dark teal
            'rgba(6, 160, 181, 0)',   // Bright cyan
          ]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }} // Start from the top
          end={{ x: 0, y: 1 }}   // End at the bottom
        />

        <ScrollView>
          <View style={styles.header}>
            <SimpleLineIcons name="music-tone-alt" size={24} color="white" />
            <Text style={styles.headerText}>
              Welcome back!{"\n"}
              <Text style={[styles.headerText, { fontSize: vs(20) }]}>Tangerine</Text>
            </Text>
            <View style={styles.headerIcons}>
              <Feather name="bar-chart-2" size={18} color="white" />
              <Feather name="bell" size={18} color="white" />
              <Ionicons name="settings-outline" size={18} color="white" />
            </View>
          </View>

          <ContinueChart continueListeningData={continueListeningData} />
          <TrendingChart continueListeningData={new_trending || []} title="Trending" type="new_trending" />
          <TrendingChart continueListeningData={top_playlists || []} title="Handpicked Playlists" type="top_playlists" />
          <TrendingChart continueListeningData={new_albums || []} title="New Albums" type="new_albums" />
          <TrendingChart continueListeningData={browse_discover || []} title="Discover" type="browse_discover" />
          <TrendingChart continueListeningData={charts || []} title="Charts" type="charts" />
          <TrendingChart continueListeningData={radio || []} title="Radio" type="radio" />

          <View style={{ marginBottom: vs(50), flex: 1 }} />
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
  },
  headerText: {
    color: "white",
    fontFamily: "Montserrat_700Bold",
    marginLeft: s(10),
  },
  headerIcons: {
    position: 'absolute',
    right: 0,
    marginRight: s(5),
    gap: s(15),
    flexDirection: 'row',
  },
});

export default Home;