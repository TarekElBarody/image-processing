import express from 'express';
import { FilePaths, ImageRequest } from '../../types/ImageRequest';
import logger from './logger';
import s3Client from '../functions/s3Client';
import { Thumb, Image } from '../../types/index';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new s3Client();

const handelCachedThumb = async (
  req: express.Request,
  res: express.Response,
  pathNames: FilePaths,
  imageReq: ImageRequest,
  imageLog: logger
): Promise<void> => {
  // get the thumb properties
  const thumb = pathNames.thumbImage as Thumb;
  const fullImage = pathNames.fullImage as Image;
  const thumbFileName = `${thumb.filename}`;

  if (imageReq.out == 'img') {
    const s3Res = await s3.getContent(thumb.bucket_key as string);
    if (s3Res.data?.Body) {
      // if output is img serve the thumb then log
      res.header(
        'Cache-Control',
        imageReq.catching === 1 ? 'max-age=31536000' : 'max-age=0'
      );
      // get the last modified date form file state

      res // set the last modified header to state file
        .setHeader('last-modified', (thumb.modified as Date).toDateString())
        .contentType('image/jpeg')
        .status(imageReq.catching === 1 ? 302 : 200) // set the status cose 302 not modified
        .send(s3Res.data?.Body); // send cached file to user

      // log the event in console & file log
      imageLog.end();
      imageLog.logT(
        `Cached thumb served to user for image ${imageReq.filename} with format ${thumb.format} with width ${thumb.width} & height ${thumb.height}`
      );
      return;
    } else {
      res.status(400).json({ message: s3Res.err });
      // log the event in console & file log
      imageLog.end();
      imageLog.logT(s3Res.err);
      return;
    }
  } else if (imageReq.out == 'json') {
    // if output is json serve the thumb json then log
    const thumbJson = {
      status: true,
      id: fullImage.id,
      user_id: fullImage.user_id,
      width: fullImage.width,
      height: fullImage.height,
      created: fullImage.created,
      access: fullImage.access,
      url: `${req.protocol}://${process.env.AWS_CLOUD_FRONT || ''}/api/images/${
        fullImage.filename
      }`,
      thumb: {
        id: thumb.id,
        image_id: thumb.image_id,
        url: `${req.protocol}://${
          process.env.AWS_CLOUD_FRONT || ''
        }/api/images/thumb/${thumbFileName}`,
        width: thumb.width,
        height: thumb.height,
        format: thumb.format,
        fit: thumb.fit,
        last_modified: thumb.modified
      }
    };
    // if json return generated json data from the class to the user
    res.status(200).json(thumbJson);
    imageLog.end();
    imageLog.logT(
      `Fetched Cached thumb as JSON data for image ${imageReq.filename} with format ${thumb.format} with width ${thumb.width} & height ${thumb.height}`
    );
  }
  return;
};

export default handelCachedThumb;
