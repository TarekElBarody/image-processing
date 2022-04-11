import express from 'express';
import { FilePaths, ImageRequest } from '../../types/ImageRequest';
import logger from './logger';
import { Thumb, Image } from '../../types/index';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const handelCachedThumb = async (
  _req: express.Request,
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
    const url = `https://${process.env.AWS_CLOUD_FRONT_BUCKET}/${pathNames.thumbDir}/${thumb.filename}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    if (
      response.status === 200 ||
      response.status === 204 ||
      response.status === 302
    ) {
      const buffer = Buffer.from(response.data, 'utf-8');
      // if output is img serve the thumb then log
      res.header(
        'Cache-Control',
        imageReq.catching === 1 ? 'max-age=31536000' : 'max-age=0'
      );
      // get the last modified date form file state

      res // set the last modified header to state file
        .setHeader('last-modified', (thumb.modified as Date).toDateString())
        .contentType(response.headers['content-type'])
        .status(imageReq.catching === 1 ? 302 : 200) // set the status cose 302 not modified
        .send(buffer); // send cached file to user

      // log the event in console & file log
      imageLog.end();
      imageLog.logT(
        `Cached thumb served to user for image ${imageReq.filename} with format ${thumb.format} with width ${thumb.width} & height ${thumb.height}`
      );
      return;
    } else {
      res.status(400).json({ message: response.statusText });
      // log the event in console & file log
      imageLog.end();
      imageLog.logT(response.statusText);
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
      url: `https://${process.env.AWS_CLOUD_FRONT_SERVER || ''}/api/images/${
        fullImage.filename
      }`,
      thumb: {
        id: thumb.id,
        image_id: thumb.image_id,
        url: `https://${
          process.env.AWS_CLOUD_FRONT_SERVER || ''
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
