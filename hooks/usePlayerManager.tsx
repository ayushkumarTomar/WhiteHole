import React, { useEffect } from 'react';
import TrackPlayer, { Event } from 'react-native-track-player';
import useMediaStore from '@/store/queue'; // Import your Zustand store
import { storeSession } from '@/lib/storage';

export default function usePlayerManager() {
  const {
    setPlayback,
    setTrack,
    setTrackIndex,
    setQueue,
    setBuffering,
  } = useMediaStore(); // Access Zustand store actions

  const {playerReady} = useMediaStore()


  useEffect(() => {

    if(!playerReady) return

    console.log("LISTENERS STARTED")
    

    const activeTrackChangedListener = TrackPlayer.addEventListener(
        Event.PlaybackActiveTrackChanged,
        async () => {
          console.log('Active track changed');
          const currentTrack = await TrackPlayer.getActiveTrack();
          //@ts-ignore
          setTrack(currentTrack);
          // Set track index if needed:
          // setTrackIndex(c);
          setPlayback(true)
          //@ts-ignore
          if(currentTrack) storeSession(currentTrack)
        }
      );
  
      const queueEndedListener = TrackPlayer.addEventListener(
        Event.PlaybackQueueEnded,
        (event) => {
          console.log('Queue ended');
          setPlayback(false);
        }
      );
  
      const playbackStateChangedListener = TrackPlayer.addEventListener(
        Event.PlaybackState,
        (event) => {
          console.log('Playback state changed:', event);

          
          if(event.state ==="paused"){
            setPlayback(false)
          }
          if (event.state === 'playing' || event.state === "paused" || event.state=='ready') {
            setBuffering(false);
            // setPlayback(false);
          } else {
            // setPlayback(true);
            setBuffering(true);
          }
        }
      );
      return () => {
        activeTrackChangedListener?.remove();
        playbackStateChangedListener?.remove();
        queueEndedListener?.remove();
      };
    }, [playerReady]);

  return null;
}