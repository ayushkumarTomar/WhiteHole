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
    topSongs:ArtistTopSong[];
    topAlbums: {
      albums: TopAlbumAritst[];
      // total: number;
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


export type Artist = {
  id: string;
  name: string;
  role: string;
  image: string;
  type: "artist";
  perma_url: string;
};

export type Rights = {
  code: string;
  cacheable: string;
  delete_cached_object: string;
  reason: string;
};

export type MoreInfo = {
  music: string;
  album_id: string;
  album: string;
  label: string;
  label_id: string | null;
  origin: string;
  is_dolby_content: boolean;
  "320kbps": string;
  encrypted_media_url: string;
  encrypted_cache_url: string;
  encrypted_drm_cache_url: string;
  encrypted_drm_media_url: string;
  album_url: string;
  duration: string;
  rights: Rights;
  cache_state: string;
  has_lyrics: string;
  lyrics_snippet: string;
  starred: string;
  copyright_text: string;
  artistMap: {
    primary_artists: Artist[];
    featured_artists: Artist[];
    artists: Artist[];
  };
  release_date: string | null;
  label_url: string;
  vcode: string;
  vlink: string;
  triller_available: boolean;
  request_jiotune_flag: boolean;
  webp: string;
};

export type ArtistTopSong = {
  id: string;
  title: string;
  subtitle: string;
  header_desc: string;
  type: "song";
  perma_url: string;
  image: string;
  language: string;
  year: string;
  play_count: string;
  explicit_content: string;
  list_count: string;
  list_type: string;
  list: string;
  more_info: MoreInfo;
};
