import { Album } from "@/types/album";
import { ArtistInfo, TopArtistsResponse } from "@/types/artists";
import { launchData } from "@/types/launchData";
import { Playlist } from "@/types/playlist";
import { SearchResponse, TrendingSearches } from "@/types/search";
import { EpisodeList, TopShows } from "@/types/shows";
import {  SongCollection } from "@/types/songs";
import axios, { AxiosResponse } from "axios";

const BASE_URL = "https://www.jiosaavn.com/api.php?__call=";

const fetchData = async <T>(params: Record<string, any>): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.get(`${BASE_URL}`, { params });

    if (!response.data) {
      throw new Error('Network response was not ok');
    }
   
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${params}:`, error);
    throw new Error(`Failed to fetch data from ${params}`);
  }
};

export const getModules = async (): Promise<any> => {
  return await fetchData({
    __call: 'webapi.getLaunchData',
    // api_version: "4",
    _format: 'json',
    _marker: '0',
  });
};

export const getSearchTrending = async (): Promise<TrendingSearches[]> => {
  return await fetchData({
    __call: 'content.getTopSearches',
    ctx: "wap6dot0",
    api_version: "4",
    _format: 'json',
    _marker: '0',
  });
};

export const getTopSearches = async (query: string): Promise<SearchResponse> => {
  // console.log("Searching for:", query);
  return await fetchData({
    __call: 'autocomplete.get',
    query: query,
    isVersion4: false,
  });
};

export const getAlbumDetails = async (albumId: string): Promise<Album> => {
  return await fetchData({
    __call: 'content.getAlbumDetails',
    _format: 'json',
    cc: 'in',
    _marker: '0',
    albumid: albumId,
  });
};

export const getPlaylistDetails = async (playListId: string): Promise<Playlist> => {
  return await fetchData({
    __call: 'playlist.getDetails',
    _format: 'json',
    cc: 'in',
    _marker: '0',
    listid: playListId,
  });
};

export const getSongDetails = async (songId: string): Promise<SongCollection> => {
  return await fetchData({
    __call: 'song.getDetails',
    _format: 'json',
    cc: 'in',
    _marker: '0',
    pids: songId,
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
  __call: 'show.getAllEpisodes',
  _format: 'json',
  cc: 'in',
  _marker: '0',
  show_id : showId
  }); 
}

export const getArtistDetails = async (artistId: string): Promise<ArtistInfo> => {
  return await fetchData({
    __call: 'artist.getArtistPageDetails',
    artistId,
    ctx: 'wap6dot0',
    api_version: '4',
    _format: 'json',
    _marker: '0',
    n_song:100 ,
    n_album :0,
    page: 1,
    sort_order:"desc" ,
    category:'popularity' ,

  });
};


export const getFooterSongsByLangugae = async (language:string): Promise<any> => {
  return await fetchData({
    __call: 'webapi.getFooterDetails',
    _format: 'json',
    language ,
  });
};


export const getTopArtists = async (): Promise<TopArtistsResponse> => {
  return await fetchData({  
    __call: 'social.getTopArtists',
    _format: 'json',
  });
};





/*

webapi.getFooterDetails
hindi
punjabi
gujarati
haryanvi
bhojpuri

social.getTopArtists

webapi.getFooterDetails

*/