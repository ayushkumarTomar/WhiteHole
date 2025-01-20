import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TrackPlayer, { Capability } from 'react-native-track-player';
import usePlayerManager from '@/hooks/usePlayerManager';
import useMediaStore from '@/store/queue';
import * as Linking from 'expo-linking';
import Loading from '@/components/loading';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};
TrackPlayer.registerPlaybackService(() => require("../service"))


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const { setPlayerReady, currentTrack, setTrack } = useMediaStore()


  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {

      SplashScreen.hideAsync();
    }
  }, [loaded]);


  useEffect(() => {
    const setUpPlayer = async () => {
      try {

        await TrackPlayer.setupPlayer(
          {
            maxCacheSize: 1024 * 10
          }
        );
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
            Capability.SeekTo
          ],
        });
        await TrackPlayer.reset();
        console.log('Track Player Setup Complete');
      } catch (error) {
        console.log('Error setting up track player:', error);
      }
      finally {
        setPlayerReady(true)
      }
    };
    setUpPlayer();
  }, []);

  useEffect(() => {
    const handleDeepLink = async (event: any) => {
      const { url } = event;
      console.log("url is :: ", url)
      if (url && url.includes('trackplayer://notification.click')) {
        console.log("url matched")
        const track = await TrackPlayer.getActiveTrack()
        console.log("deep link set to false")
        if (track) {
          //@ts-ignore

          setTrack(track)
          //@ts-ignore

          Linking.openURL(`myapp://music/${track.songId}`);
        }
      }
    };
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  usePlayerManager()
  if (!loaded) {
    return null; // Wait for both fonts and player setup to be complete
  }


  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>

        <Stack screenOptions={{ contentStyle: { backgroundColor: 'black' } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, headerLargeTitle: true, headerTitle: "Home", statusBarTranslucent: true }} />
          <Stack.Screen name="(pages)" options={{ headerShown: false, headerLargeTitle: true, headerTitle: "Home", statusBarTranslucent: true, animation: "slide_from_right" }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false, statusBarTranslucent: true }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
