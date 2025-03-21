import { MoreInfo } from "./search";

export type Song = {
    id: string;
    type: string;
    song: string;
    album: string;
    year: string;
    music: string;
    music_id: string;
    primary_artists: string;
    primary_artists_id: string;
    featured_artists: string;
    featured_artists_id: string;
    singers: string;
    starring: string;
    image: string;
    label: string;
    albumid: string;
    language: string;
    origin: string;  // origin can be more than just "album"
    play_count: string;
    is_drm: number;
    copyright_text: string;
    '320kbps': string;
    is_dolby_content: boolean;
    explicit_content: number;
    has_lyrics: string;
    lyrics_snippet: string;
    encrypted_drm_media_url: string;
    encrypted_media_url: string;
    encrypted_media_path: string;
    media_preview_url: string;
    perma_url: string;
    album_url: string;
    duration: string;
    rights: {
      code: number;
      reason: string;
      cacheable: boolean;
      delete_cached_object: boolean;
    };
    webp: boolean;
    cache_state?: string;  // ye optional field hai
    starred: string;  
    artistMap: Record<string, string>;
    release_date: string;
    vcode: string;
    vlink: string;
    triller_available: boolean;
    label_url: string;
  };
  
export type SongSearch = {
  id: string;
  title: string;
  image: string;
  album: string;
  url: string;
  type: "song";
  description: string;
  ctr: number;
  position: number;
  more_info: MoreInfo;
};


export type SongCollection = {
  [key: string]: Song;
};