import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TrackPlayer, { Capability } from 'react-native-track-player';
import usePlayerManager from '@/hooks/usePlayerManager';
import useMediaStore from '@/store/queue';
import * as Linking from 'expo-linking';
import Loading from '@/components/loading';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};
// TrackPlayer.registerPlaybackService(() => require("../service"))
let isServiceRegistered = false;
let isPlayerInitialized = false;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const { setPlayerReady, currentTrack, setTrack } = useMediaStore()
  const initializationRef = useRef<Promise<void> | null>(null);


  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {

      SplashScreen.hideAsync();
    }
  }, [loaded]);

  //   const setUpPlayer = async () => {
  //     try {

  //       await TrackPlayer.setupPlayer(
  //         {
  //           maxCacheSize: 1024 * 10
  //         }
  //       );
  //       await TrackPlayer.updateOptions({
  //         capabilities: [
  //           Capability.Play,
  //           Capability.Pause,
  //           Capability.SkipToNext,
  //           Capability.SkipToPrevious,
  //           Capability.Stop,
  //           Capability.SeekTo
  //         ],
  //       });
  //       await TrackPlayer.reset();
  //       console.log('Track Player Setup Complete');
  //     } catch (error) {
  //       console.log('Error setting up track player:', error);
  //     }
  //     finally {
  //       setPlayerReady(true)
  //     }
  //   };
  //   setUpPlayer();
  // }, []);

  useEffect(() => {
    const registerService = () => {
      if (!isServiceRegistered) {
        TrackPlayer.registerPlaybackService(() => require("../service"));
        isServiceRegistered = true;
      }
    };

    registerService();

    const setUpPlayer = async () => {
      try {
        if (!initializationRef.current) {
          initializationRef.current = (async () => {
            if (!isPlayerInitialized) {
              await TrackPlayer.setupPlayer({ maxCacheSize: 1024 * 10 });
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
              isPlayerInitialized = true;
            }
            await TrackPlayer.reset();
            console.log('Track Player Setup Complete');
          })();
        }
        await initializationRef.current;
      } catch (error) {
        console.log('Error setting up track player:', error);
      } finally {
        setPlayerReady(true);
      }
    };

    setUpPlayer();

    return () => {
      initializationRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleDeepLink = async (event: any) => {
      const { url } = event;
      if (url && url.includes('trackplayer://notification.click')) {
        const track = await TrackPlayer.getActiveTrack()
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
    return <Loading/>;
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
