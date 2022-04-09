export enum ImageAccess {
  PUBLIC = 0,
  USERS = 1,
  ME = 2
}
export type Image = {
  id: string;
  user_id: string;
  filename: string;
  width: number;
  height: number;
  created: Date;
  bucket_key: string;
  access: ImageAccess;
};

export type ImageRes = {
  id: string;
  user_id: string;
  url: string;
  width: number;
  height: number;
  created: Date;
  access: ImageAccess;
};

export type Thumb = {
  id: string;
  image_id: string;
  filename: string;
  width: number;
  height: number;
  format: string;
  fit: string;
  modified: Date;
  bucket_key: string;
};

export type ThumbFind = {
  image_id: string;
  width: number;
  height: number;
  format: string;
  fit: string;
};
