import express from 'express';
import logger from '../functions/logger';
import ThumbStore from '../../models/thumbStore';
import s3Client from '../functions/s3Client';
import { Thumb } from '../../types/index';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new s3Client();

const thumbStore = new ThumbStore();

const thumbFetch = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // get Jasmine test variables (jasmine token)
  // bypass login and create test login for jasmine

  if (req.session.user && req.session.isToken === true) {
    // configure logger to use userAccess.log file
    const imageLog = new logger('imageLog');
    imageLog.start(); // start the log time function event

    const thumb = (await thumbStore.findByName(req.params.filename)) as Thumb;

    const s3Res = await s3.getContent(thumb.bucket_key as string);
    if (s3Res.data?.Body) {
      // if output is img serve the thumb then log
      res.header('Cache-Control', 'max-age=31536000');
      // get the last modified date form file state

      res // set the last modified header to state file
        .setHeader('last-modified', (thumb.modified as Date).toDateString())
        .contentType('image/jpeg')
        .status(302) // set the status cose 302 not modified
        .send(s3Res.data?.Body); // send cached file to user

      // log the event in console & file log
      imageLog.end();
      imageLog.logT(
        `Cached thumb served to user for image ${thumb.filename} with format ${thumb.format} with width ${thumb.width} & height ${thumb.height}`
      );
      return;
    } else {
      res.status(400).json({ message: s3Res.err });
      // log the event in console & file log
      imageLog.end();
      imageLog.logT(s3Res.err);
      return;
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      message: 'you have to log in to you dashboard first to can call this'
    });
  }

  return;
};

export default thumbFetch;
