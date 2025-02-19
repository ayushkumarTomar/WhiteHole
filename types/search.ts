import { AlbumSearch } from "./album";
import { ArtistSearch } from "./artists";
import { PlaylistSearch } from "./playlist";
import { Episode, ShowSearch } from "./shows";
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




export type SearchResponse = {
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
    data: Episode[];
    position: number;
  };
};


type ItemType = 'song' | 'album' | 'artist';

type MoreInfoType = {
  artistMap: any[]; 
  album: string;
};

export type TrendingSearches = {
  id: string;
  title: string;
  subtitle: string;
  type: ItemType;
  image: string;
  perma_url: string;
  more_info: MoreInfoType;
  explicit_content: string;
  mini_obj: boolean;
};

