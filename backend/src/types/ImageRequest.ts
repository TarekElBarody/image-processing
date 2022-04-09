import { Image, Thumb } from './imageType';

export type ImageRequest = {
  filename: string;
  width: number;
  height: number;
  format: string;
  fit: string;
  catching: number;
  out: string;
};

export type FilePaths = {
  fullDir: string;
  thumbDir: string;
  fullImage: Image | undefined;
  thumbImage: Thumb | undefined;
  success: boolean;
  error: string;
};

export type ThumbProps = {
  thumbFile: string;
  width: number;
  height: number;
  format: string;
};

export type PrepThumbs = {
  original: string;
  thumbs: ThumbProps[];
};

export type OutputInfo = {
  format: string;
  size: number;
  width: number;
  height: number;
  channels: 1 | 2 | 3 | 4;
  premultiplied: boolean;
  cropOffsetLeft?: number | undefined;
  cropOffsetTop?: number | undefined;
  trimOffsetLeft?: number | undefined;
  trimOffsetTop?: number | undefined;
};

export type ResMessage = {
  status: boolean;
  message: string;
  path: string;
  info: OutputInfo;
  json: object;
};
