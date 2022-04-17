import express from 'express';
import logger from '../functions/logger';
import ThumbStore from '../../models/thumbStore';
import { Thumb } from '../../types/index';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import sharp from 'sharp';

dotenv.config();
const thumbDir =
  process.env.ENV == 'production' ? 'upload/thumb' : 'test/thumb';

const thumbStore = new ThumbStore();

const thumbFetch = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // get Jasmine test variables (jasmine token)
  // bypass login and create test login for jasmine

  // configure logger to use userAccess.log file
  const imageLog = new logger('imageLog');
  imageLog.start(); // start the log time function event

  const thumb = (await thumbStore.findByName(req.params.filename)) as Thumb;
  if (thumb) {
    if (process.env.ENV === 'test') {
      const testImageFile = 'for_test_jasmine_image_dont_deleted.jpg';
      const testImagePath = path.resolve(`./tmp/${testImageFile}`);
      const buffer = await sharp(testImagePath).toBuffer();

      res.header('Cache-Control', 'max-age=31536000');
      // get the last modified date form file state

      res // set the last modified header to state file
        .setHeader('last-modified', (thumb.modified as Date).toDateString())
        .contentType('image/jpeg')
        .status(302) // set the status cose 302 not modified
        .send(buffer); // send cached file to user

      // log the event in console & file log
      imageLog.end();
      imageLog.logT(
        `Cached thumb served to user for image ${thumb.filename} with format ${thumb.format} with width ${thumb.width} & height ${thumb.height}`
      );
      return;
    } else {
      const url = `https://${process.env.IMAGES_CLOUD}/${thumbDir}/${thumb.filename}`;
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      if (
        response.status === 200 ||
        response.status === 204 ||
        response.status === 302
      ) {
        const buffer = Buffer.from(response.data, 'utf-8');
        // if output is img serve the thumb then log
        res.header('Cache-Control', 'max-age=31536000');
        // get the last modified date form file state

        res // set the last modified header to state file
          .setHeader('last-modified', (thumb.modified as Date).toDateString())
          .contentType(response.headers['content-type'])
          .status(302) // set the status cose 302 not modified
          .send(buffer); // send cached file to user

        // log the event in console & file log
        imageLog.end();
        imageLog.logT(
          `Cached thumb served to user for image ${thumb.filename} with format ${thumb.format} with width ${thumb.width} & height ${thumb.height}`
        );
        return;
      } else {
        res.status(400).json({ message: response.statusText });
        // log the event in console & file log
        imageLog.end();
        imageLog.logT(response.statusText);
        return;
      }
    }
  }

  return;
};

export default thumbFetch;
