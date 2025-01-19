import {AlbumMini} from "./album";
import { Song } from "./songs";
import { PlaylistMini } from "./playlist";
export type TopPlaylist = {
    listid: string;
    secondary_subtitle: string;
    firstname: string;
    listname: string;
    data_type: string;
    count: number;
    image: string;
    sponsored: boolean;
    perma_url: string;
    follower_count: string;
    uid: string;
    last_updated: number;
  };
export type NewTrending = 
  | {
      type: "playlist";
      details: PlaylistMini;
      weight: number;
      language: string;
    }
  | {
      type: "album";
      details: AlbumMini;
      weight: number;
      language: string;
    }
  | {
      type: "song";
      details: Song;
      weight: number;
      language: string;
    };

export type NewAlbums = {
    query: string;
    text: string;
    year: string;
    image: string;
    albumid: string;
    title: string;
    Artist: {
        music: { id: string; name: string }[];
      };
    weight: number;
    language: string;
}

type BrowseDiscover = {
    id: string;
    title: string;
    subtitle: string;
    type: string;
    image: string;
    perma_url: string;
    more_info: {
        badge: string;
        sub_type: string;
        available: string;
        is_featured: string;
        tags: {
        situation: string[];
        };
        video_url: string;
        video_thumbnail: string;
    };
    explicit_content: string;
    mini_obj: boolean;
}

export type Charts = {
    id: string;
    title: string;
    subtitle: string;
    type: string;
    image: string;
    perma_url: string;
    more_info: {
      firstname: string;
    };
    explicit_content: string;
    mini_obj: boolean;
    language: string;
}

export type Radio = {
    name: string;
    description: string;
    image: string;
    featured_station_type: string;
    query: string;
    color: string;
    language: string;
    station_display_text: string;
}
export type launchData = {
    history: [];
    new_trending: NewTrending[];
    top_playlists: TopPlaylist[];
    new_albums: NewAlbums[];
    browse_discover:BrowseDiscover[];
    global_config: any;
    charts: Charts[];
    radio: Radio[];


}


export type Item = {
  id: string;
  title: string;
  action: string;
};

export type LanguageFooter = {
  playlist: Item[];
  artist: Item[];
  album: Item[];
  actor: Item[];
};



 