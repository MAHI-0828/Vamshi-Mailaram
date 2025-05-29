export enum MediaType {
  Image = 'IMAGE',
  YouTubeVideo = 'YOUTUBE_VIDEO',
  InstagramReel = 'INSTAGRAM_REEL',
  GenericVideo = 'GENERIC_VIDEO',
  BeforeAfter = 'BEFORE_AFTER'
}

export interface BaseMediaItem {
  type: MediaType;
  src: string;
  altText?: string;
  description?: string;
}

export interface BeforeAfterMediaItem extends BaseMediaItem {
  type: MediaType.BeforeAfter;
  beforeSrc: string;
  afterSrc: string;
}

export type MediaItem = BaseMediaItem | BeforeAfterMediaItem;

export interface TimelineEventData {
  id: string;
  date: string;
  title: string;
  category: string;
  description: string;
  eventProfileImageUrl: string;
  media: MediaItem[];
}
