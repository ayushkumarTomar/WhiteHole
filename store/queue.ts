import { getSongParsedData, parseTrackPlayer , Track } from "@/lib/mediaProcess";
import TrackPlayer from "react-native-track-player";
import {create} from "zustand"



interface Store {
  token: string | null; 

  isPlaying: boolean;
  currentTrack: Track | null;
  currentTrackIndex: number;
  isBuffering:boolean;
  playerReady:boolean;

  addTrack : (songId:string , type:"addToQueue" |"playNext" | "playNow" , offline?:boolean , offlineSongData?:Track)=>void;
  removeTrack : (songId:string)=>void;



  
  songLoading:boolean;

  playlist: Track[];
  queue: Track[];
  currentPlaylistId: string | null;
  downloadProgress:number;

  setDownloadProgress :(downloadProgress:number)=>void;
  setPlayerReady : (ready:boolean)=>void;

  setBuffering: (buffering: boolean) => void;

  setPlayback: (isPlaying: boolean) => void;
  setTrack: (track: Track | null) => void;
  setTrackIndex: (index: number) => void;
  setPlaylist: (playlist: Track[]) => void;
  setQueue: (queue: Track[]) => void;
  resetPlayer: () => void;


 
}

const useMediaStore = create<Store>((set) => ({
  user: null,
  token: null,
  songLoading:false,
  isBuffering: false ,

  isPlaying: false,
  currentTrack: null,
  currentTrackIndex: 0,
  playbackPosition: 0,
  volume: 0.5,
  playerReady:false ,
  setPlayerReady:(ready:boolean)=>set({playerReady:ready}) ,

  playlist: [],
  queue: [],
  currentPlaylistId: null,


  downloadProgress:0,
  setDownloadProgress : (downloadProgress)=> set({downloadProgress:downloadProgress}) ,


  setBuffering: (buffering) => set({isBuffering:buffering}) ,

  setPlayback: async(isPlaying) => {
    if(isPlaying) 
      await TrackPlayer.play()
    else await TrackPlayer.pause()
    set({ isPlaying })
  },


  removeTrack : async(songId:string)=>{
    try {
      const queue = await TrackPlayer.getQueue();
      const index = queue.findIndex((track) => track.songId === songId);
      if (index !== -1) {
        await TrackPlayer.remove(index);
        const updatedQueue = await TrackPlayer.getQueue();
        //@ts-ignore
        set({ queue: updatedQueue });
        console.log("Track removed from the queue.");
      } else {
        console.log("Track not found in the queue.");
      }
    } catch (error) {
      console.error("Failed to remove track from TrackPlayer queue:", error);
    }
  },

  addTrack : async(songId: string, type: "addToQueue" | "playNext" |"playNow" | "getParsedData" , offline = false , offlineSongData) => {
    try {
      let parsedData:Track;
    if(!offline){console.log("Received song ID:", songId);
    
    const d = await getSongParsedData(songId);
    if(!d) return;
    parsedData = d;

}
    else{
      //@ts-ignore
      parsedData = offlineSongData
    }
      
      const queue = await TrackPlayer.getQueue();
      const alreadyExist = queue.findIndex((track) => track.songId === parsedData.songId);
      if(alreadyExist!==-1) await TrackPlayer.remove(alreadyExist);
      if (type === "addToQueue") {
        await TrackPlayer.add(parsedData);
      } else if (type === "playNext") {
        const currentIndex = await TrackPlayer.getActiveTrackIndex();
        await TrackPlayer.add(parsedData, currentIndex !== undefined ? currentIndex + 1 : 0);
      } else if (type==="playNow") {
        const currentIndex = await TrackPlayer.getActiveTrackIndex();
        if (currentIndex !== undefined) {
            await TrackPlayer.add(parsedData, currentIndex + 1);
            await TrackPlayer.skipToNext();
        } else {
            await TrackPlayer.add(parsedData , 0);
        }
      }
  
      const updatedQueue = await TrackPlayer.getQueue();
      //@ts-ignore
      set({ queue: updatedQueue });
  
      console.log("Track successfully added to the queue.");
    } catch (error) {
      console.error("Failed to add track to TrackPlayer queue:", error);
    }
  }
   ,
  setTrack: (track) => set({ currentTrack: track }),
  setTrackIndex: (index) => set({ currentTrackIndex: index }),
  setPlaylist: (playlist) => set({ playlist }),
  setQueue: async(queue) => {
    set({ queue })
    await TrackPlayer.setQueue(queue)
  },
  
  resetPlayer: async() => {
    await TrackPlayer.reset();
    set({ queue: [] });
  },
}));


export default useMediaStore;
