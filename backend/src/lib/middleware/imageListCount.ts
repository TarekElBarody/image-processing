import express from 'express';
import logger from '../functions/logger';
import ImageStore from '../../models/imageStore';
import ThumbStore from '../../models/thumbStore';

const imageStore = new ImageStore();
const thumbStore = new ThumbStore();

const imageListCount = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // get Jasmine test variables (jasmine token)
  // bypass login and create test login for jasmine

  if (req.session.user && req.session.isToken === true) {
    // configure logger to use userAccess.log file
    const userAccess = new logger('userAccess');
    userAccess.start(); // start the log time function event

    const fullFiles = await imageStore.count(req.session.user.id);
    const thumbFiles = await thumbStore.count(req.session.user.id);

    // set the respond json to have count of each folder images list
    const resJson = {
      fullCount: fullFiles,
      thumbCount: thumbFiles
    };

    // send the json to the user
    res.status(200).json(resJson);

    // log the event in console & file log
    userAccess.end(); // end the log time function event
    userAccess.logT(
      `User ${req.session.user} get folders count fullCount: ${fullFiles} thumbCount: ${thumbFiles}`
    );
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      message: 'you have to log in to you dashboard first to can call this'
    });
  }

  return;
};

export default imageListCount;
