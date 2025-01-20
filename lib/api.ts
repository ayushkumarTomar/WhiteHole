import { Album } from "@/types/album";
import { ArtistInfo } from "@/types/artists";
import { launchData } from "@/types/launchData";
import { Playlist } from "@/types/playlist";
import { EpisodeList, TopShows } from "@/types/shows";
import { Song, SongCollection } from "@/types/songs";
import axios, { AxiosResponse } from "axios";

// Base URL for all API calls
const BASE_URL = "https://www.jiosaavn.com/api.php?__call=";

// Helper function to make requests to the API and handle errors
const fetchData = async <T>(params: Record<string, any>): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.get(`${BASE_URL}`, { params });

    if (!response.data) {
      throw new Error('Network response was not ok');
    }
    // @ts-ignore
    // if(response.data.new_trending) console.log("RETURNED DATA :: " , JSON.stringify(response.data.new_trending))
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${params}:`, error);
    throw new Error(`Failed to fetch data from ${params}`);
  }
};

// Fetch the launch data
export const getModules = async (): Promise<any> => {
  return await fetchData({
    __call: 'webapi.getLaunchData',
    // api_version: "4",
    _format: 'json',
    _marker: '0',
  });
};

// Fetch trending search data
export const getSearchTrending = async (): Promise<any> => {
  return await fetchData({
    __call: 'content.getTopSearches',
    ctx: "wap6dot0",
    api_version: "4",
    _format: 'json',
    _marker: '0',
  });
};

// Search for top queries (autocomplete)
export const getTopSearches = async (query: string): Promise<launchData> => {
  console.log("Searching for:", query);
  return await fetchData({
    __call: 'autocomplete.get',
    query: query,
    isVersion4: false,
  });
};

// Fetch details of a specific album
export const getAlbumDetails = async (albumId: string): Promise<Album> => {
  return await fetchData({
    __call: 'content.getAlbumDetails',
    _format: 'json',
    cc: 'in',
    _marker: '0',
    albumid: albumId,
  });
};

// Fetch details of a specific playlist
export const getPlaylistDetails = async (playListId: string): Promise<Playlist> => {
  return await fetchData({
    __call: 'playlist.getDetails',
    _format: 'json',
    cc: 'in',
    _marker: '0',
    listid: playListId,
  });
};

// Fetch details of a specific song
export const getSongDetails = async (songId: string): Promise<SongCollection> => {
  return await fetchData({
    __call: 'song.getDetails',
    _format: 'json',
    cc: 'in',
    _marker: '0',
    pids: songId,
  });
};

// Fetch details of a specific artist
export const getAristDetails = async (artistId: string): Promise<ArtistInfo> => {
  return await fetchData({
    __call: 'content.getAlbumDetails',
    _format: 'json',
    cc: 'in',
    _marker: '0',
    artistId,
  });
};
export const getTopShows = async() : Promise<TopShows> =>{
  return await fetchData({
    __call: 'content.getTopShows',
    _format: 'json',
    cc: 'in',
    _marker: '0',
  }); 
}

export const getShowDetails = async(showId:string) : Promise<EpisodeList> =>{ 
  return await fetchData({
  __call: 'webapi.get',
  _format: 'json',
  cc: 'in',
  _marker: '0',
  show_id : showId
  }); 
}



