import { TopAlbumAritst } from "./album";
import { Song } from "./songs";

export type TopArtistItem =  {
    artistid: string;
    name: string;
    image: string;
    follower_count: number;
    is_followed: boolean;
  }
  
export type TopArtistsResponse = {
    top_artists: TopArtistItem[];
    status: string;
  }


export type ArtistInfo = {
    artistId: string;
    name: string;
    subtitle: string;
    image: string;
    follower_count: string;
    type: "artist";
    isVerified: boolean;
    dominantLanguage: string;
    dominantType: string;
    topSongs: {
      songs: Song[];
      total: number;
    };
    topAlbums: {
      albums: TopAlbumAritst[];
      total: number;
    };
    similarArtists: any[]; // This is an empty array in the example, adjust based on future data
    isRadioPresent: boolean;
    bio: string[];
    dob: string;
    fb: string;
    twitter: string;
    wiki: string;
    urls: {
      albums: string;
      bio: string;
      comments: string;
      songs: string;
    };
    availableLanguages: string[];
    fan_count: string;
    is_followed: boolean;
  };


export type ArtistSearch = {
  id: string;
  title: string;
  image: string;
  extra: string;
  url: string;
  type: "artist";
  description: string;
  ctr: number;
  entity: number;
  position: number;
};