import express from 'express';
import logger from '../functions/logger';
import ImageStore from '../../models/imageStore';
import { ImageRes } from '../../types/index';
import dotenv from 'dotenv';

dotenv.config();
const imageStore = new ImageStore();

const imageList = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // get Jasmine test variables (jasmine token)
  // bypass login and create test login for jasmine

  if (req.session.user && req.session.isToken === true) {
    // configure logger to use userAccess.log file
    const userAccess = new logger('userAccess');
    userAccess.start(); // start the log time function event

    const images = await imageStore.index(req.session.user.id);

    const fetchImages: ImageRes[] = [];

    for (let i = 0; i < images.length; i++) {
      const url = `https://${process.env.API_SERVER || ''}/api/images/${
        images[i].filename
      }`;

      fetchImages.push({
        // return the json data for each file in the thumb directory
        id: images[i].id,
        user_id: images[i].user_id,
        url: url,
        width: images[i].width,
        height: images[i].height,
        created: images[i].created,
        access: images[i].access
      });
    }

    // pass the json images into main json responds
    const imagJson = {
      success: true,
      image_count: images.length,
      images: fetchImages
    };

    // send the image json data to the user
    res.status(200).json(imagJson);

    // log the event in console & file log
    userAccess.end(); // end the log time function event
    userAccess.logT(`User ${req.session.user.id} call all images he owens`);
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      message: 'you have to log in to you dashboard first to can call this'
    });
  }

  return;
};

export default imageList;
