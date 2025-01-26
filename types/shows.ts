
type ShowMoreInfo =  {
  season_number: string;
  release_date: string;
  square_image: string;
  year?: string;
  badge?: string;
}

export type Show = {
  id: string;
  title: string;
  subtitle: string;
  type: "show";
  image: string;
  perma_url: string;
  more_info: ShowMoreInfo;
  explicit_content: string;
  mini_obj: boolean;
}

export type TopShows = {
  shows: Show[];
}

export type ShowSearch = {
  id: string;
  title: string;
  image: string;
  type: "show";
  season_number: number;
  description: string;
  url: string;
  position: number;
};


type ShowArtist = {
  id: string;
  name: string;
  role: 'Host' | 'Guest' | string;
  image: string;
  type: 'artist';
  perma_url: string;
};

type Rights = {
  code: string;
  reason: string;
  cacheable: boolean;
  delete_cached_object: boolean;
};

type MoreInfo = {
  release_date: string;
  release_time: string;
  label_id: string;
  duration: string;
  square_image_url: string;
  entity_title_exact_match: string;
  description: string;
  season_no: string;
  sequence_number: string;
  show_id: string;
  season_id: string;
  show_title: string;
  season_title: string;
  square_image: string;
  artistMap: {
    primary_artists: ShowArtist[];
    featured_artists: ShowArtist[];
    artists: ShowArtist[];
  };
  episode_number: string;
  encrypted_drm_media_url: string;
  label: string;
  origin: string;
  ad_breaks: string;
  multi_br: string;
  rights: Rights;
  starred: string;
  cache_state: string;
  show_url: string;
  encrypted_media_url: string;
};

type Episode = {
  id: string;
  title: string;
  subtitle: string;
  header_desc: string;
  type: 'episode';
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
  button_tooltip_info: any[];  // Assuming button_tooltip_info is an array
};

// Define a type for the list of episodes
export type EpisodeList = Episode[];
