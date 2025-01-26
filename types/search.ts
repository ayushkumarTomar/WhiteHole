import { AlbumSearch } from "./album";
import { ArtistSearch } from "./artists";
import { PlaylistSearch } from "./playlist";
import { ShowSearch } from "./shows";
import { SongSearch } from "./songs";

export type MoreInfo = {
    year: string;
    is_movie: string;
    language: string;
    song_pids: string;
    vcode?: string;
    vlink?: string;
    primary_artists?: string;
    singers?: string;
    video_available?: boolean | null;
    triller_available?: boolean;
  };
  
  
  
 
  type DataResponse = {
    albums: {
      data: AlbumSearch[];
      position: number;
    };
    songs: {
      data: SongSearch[];
      position: number;
    };
    playlists: {
      data: PlaylistSearch[];
      position: number;
    };
    artists: {
      data: ArtistSearch[];
      position: number;
    };
    topquery: {
      data: ArtistSearch[];
      position: number;
    };
    shows: {
      data: ShowSearch[];
      position: number;
    };
    episodes: {
      data: any[]; // Empty array, so this can be any type for now
      position: number;
    };
  };
  