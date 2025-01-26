import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track } from '@/lib/mediaProcess';
import { PlaylistStorage } from '@/types/playlist';
import * as FileSystem from 'expo-file-system';
import useMediaStore from '@/store/queue';
const generatePlaylistId = () => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

const fetchFromStorage = async (key: string , dict=false) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : dict ? {} : [];
  } catch (err) {
    console.warn(`Error fetching ${key}:`, err);
    return dict ? {} : [];
  }
};

const saveToStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key}:`, err);
  }
};

export const storeSession = async (song: Track) => {
  try {
    let session = await fetchFromStorage('lastSession');
    session.unshift(song);
    if (session.length > 10) session.length = 10;
    await saveToStorage('lastSession', session);
  } catch (error) {
    console.log('Error storing session:', error);
  }
};

export const getLastSession = async () => fetchFromStorage('lastSession');

export const saveFavourite = async (song: Track) => {
  const favourites = await fetchFromStorage('favourites');
  favourites.push(song);
  await saveToStorage('favourites', favourites);
};

export const getFavourites = async () => fetchFromStorage('favourites');

export const checkFavourite = async (songId: string) => {
  const favourites = await fetchFromStorage('favourites');
  return favourites.some((s: Track) => s.songId === songId);
};

export const removeFavourite = async (songId: string) => {
  let favourites = await fetchFromStorage('favourites');
  favourites = favourites.filter((s: Track) => s.songId !== songId);
  await saveToStorage('favourites', favourites);
};

export const savePlaylist = async (song: Track, playlistName: string) => {
  try {
    let playlists = await fetchFromStorage('playlists');
    const existingPlaylist = playlists.find((p: PlaylistStorage) => p.name === playlistName);

    if (existingPlaylist) {
      if (!existingPlaylist.songs.some((s: Track) => s.songId === song.songId)) {
        existingPlaylist.songs.push(song);
        existingPlaylist.artwork = song.artwork;
      }
    } else {
      playlists.push({
        name: playlistName,
        playListId: generatePlaylistId(),
        artwork: song.artwork,
        songs: [song],
      });
    }

    await saveToStorage('playlists', playlists);
    return playlists;
  } catch (error) {
    console.log('Error saving playlist:', error);
    return [];
  }
};

export const getPlaylistDetails = async (playlistId: string) => {
  const playlists = await fetchFromStorage('playlists');
  return playlists.find((p: PlaylistStorage) => p.playListId === playlistId);
};

export const getPlaylists = async () => fetchFromStorage('playlists');

export const deletePlaylist = async (playlistId: string) => {
  let playlists = await fetchFromStorage('playlists');
  playlists = playlists.filter((p: PlaylistStorage) => p.playListId !== playlistId);
  await saveToStorage('playlists', playlists);
};




export const deleteSongFromPlaylist = async (playlistId: string, songId: string) => {
  let playlists = await fetchFromStorage('playlists');
  const playlist = playlists.find((p: PlaylistStorage) => p.playListId === playlistId);
  playlist.songs = playlist.songs.filter((s: Track) => s.songId !== songId);
  await saveToStorage('playlists', playlists);
}


export const downloadSong = async (songData:Track) => {
  if(!songData.title || !songData.url) return;
  const fileUri = FileSystem.documentDirectory + songData.songId + '.mp3';
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (fileInfo.exists || (await getDownloadMetaData(songData.songId))) {
    useMediaStore.getState().setDownloadProgress(100); // Already downloaded
    return fileUri;
  }

  try {
    const downloadResumable = FileSystem.createDownloadResumable(
      songData.url,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100;
        useMediaStore.getState().setDownloadProgress(progress); // Update Zustand store
      }
    );

    const d = await downloadResumable.downloadAsync();
    useMediaStore.getState().setDownloadProgress(100); // Set to 100% after download
    setDownloadMetaData(songData.songId , songData)
    return d?.uri;
  } catch (error) {
    console.error('Download failed:', error);
    useMediaStore.getState().setDownloadProgress(0); // Reset on error
    return null;
  }
};

export const listDownloadedSongs = async () => {
  if(FileSystem.documentDirectory){
  const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
  return files.filter(file => file.endsWith('.mp3'));
  }
  return [];
};

export const getSongUri = async (filename:string) => {
  const fileUri = FileSystem.documentDirectory + filename + '.mp3';

  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  return fileInfo.exists ? fileUri : null;
};


export const deleteDownloadedSong = async (filename: string) => {
  const fileUri = FileSystem.documentDirectory + filename + ".mp3";
  try {
    await FileSystem.deleteAsync(fileUri);
  } catch (error) {
    console.error('Failed to delete song:', error);
  }
};


export const setDownloadMetaData = async (songId: string, metadata: object) => {
  try {
    const metadataStore = (await fetchFromStorage('downloadMetadata')) || {};
    metadataStore[songId] = metadata;
    await saveToStorage('downloadMetadata', metadataStore);
  } catch (error) {
    console.error("Error setting metadata:", error);
  }
};

export const removeDownloadedMetaData = async (songId: string) => {
  const metadataStore = (await fetchFromStorage("downloadMetadata")) || {};
  delete metadataStore[songId];
  await saveToStorage('downloadMetadata', metadataStore);
};

export const getDownloadMetaData = async (songId: string): Promise<Track | null> => {
  return (await fetchFromStorage('downloadMetadata'))?.[songId] || null;
};

export const combineMetaDataWithSong = async () => {
  try {
    const fileData = await listDownloadedSongs();
    const downloadMetaData: Record<string, Track> = (await fetchFromStorage("downloadMetadata")) || {};
    
    const combinedData = fileData.map((fileName) => {
      const songId = fileName.replace(".mp3", "");
      return downloadMetaData[songId] ? { ...downloadMetaData[songId], url: FileSystem.documentDirectory + fileName } : null;
    }).filter(song => song !== null);
    
    return combinedData;
  } catch (error) {
    console.error("Error combining metadata with songs:", error);
    return [];
  }
};

