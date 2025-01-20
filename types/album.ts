import { MoreInfo } from "./search";
import {Song} from "./songs"
export type AlbumMini = {
  title: string;
  secondary_subtitle: string;
  image: string;
  albumid: string;
  release_date: string;
  song_count: string;
  language: string;
  perma_url: string;
  artist :{
    id: string;
    name: string;
  }
}

export type TopAlbumAritst = {
  numSongs: number;
  album: string;
  year: string;
  albumid: string;
  imageUrl: string;
  language: string;
  artistHash: {
    music: [string, string][];
    singers: [string, string][];
  };
  artistIDMap: {
    [key: string]: string;
  };
  primaryArtists: string;
  explicitContent: string;
  score: string;
  ctr: number;
  music: string;
  music_id: string;
  singers: string;
  singers_id: string;
  max_allowed: number;
  primaryArtistsIds: string;
  url: string;
  is_movie: string;
  song_pids: string;
  starring: string | null;
}
export type Album = {
    title: string;
    name: string;
    year: string;
    release_date: string;
    primary_artists: string;
    primary_artists_id: string;
    albumid: string;
    perma_url: string;
    image: string;
    songs: Song[];
  };

export type AlbumSearch = {
  id: string;
  title: string;
  image: string;
  music: string;
  url: string;
  type: "album";
  description: string;
  ctr: number;
  position: number;
  more_info: MoreInfo;
};