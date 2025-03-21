import { Track } from "@/lib/mediaProcess";
import { Song } from "./songs";

export type Playlist = {
    artists: string[];
    listid: string;
    listname: string;
    content_list: string[]; 
    perma_url: string;
    follower_count: string;
    uid: string;
    last_updated: string;
    username: string;
    firstname: string;
    lastname: string;
    is_followed: boolean | null;
    isFY: boolean;
    image: string;
    share: string;
    songs : Song[]
  };

export type PlaylistMini = {
    listid: string;
    image: string;
    isWeekly: boolean;
    listname: string;
    secondary_subtitle: string;
    firstname: string;
    song_count: string;
    follower_count: string;
    fan_count: string;
    perma_url: string;
}

export type PlaylistSearch = {
  id: string;
  title: string;
  image: string;
  extra: string;
  url: string;
  language: string;
  type: "playlist";
  description: string;
  position: number;
  more_info: null;
};


export type PlaylistStorage = {
  name: string;
  playListId: string;
  artwork: string;
  songs: Track[];
}



