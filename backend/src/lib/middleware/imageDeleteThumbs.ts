import fs from 'fs';
import path from 'path';
import express from 'express';
import logger from '../functions/logger';

const imageDeleteThumbs = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // bypass login and create test login for jasmine
  // if user not logged in return an error message

  // if user logged in
  if (req.session.user && req.session.isToken === true) {
    // configure logger to use userAccess.log file
    const userAccess = new logger('userAccess');
    userAccess.start(); // start the log time function event

    // set thumb dir paths
    const pathDir = path.resolve('./images/thumb');
    if (fs.existsSync(pathDir)) {
      //if folder exists perform rm -f -r to the directory to remove it
      fs.rm(pathDir, { recursive: true, force: true }, (err) => {
        if (err) {
          // return error if not success
          res.status(400).json({
            success: false,
            message: 'Error while clear Cached images from the disk !'
          });
          // log the event in console & file log
          userAccess.end(); // end the log time function event
          userAccess.logT(
            `User ${req.session.user} Error while clear Cached images from the disk !}`
          );
        } else {
          // return success message to the user
          res.status(200).json({
            success: true,
            message: 'Cached images deleted from the disk successfully'
          });
          // log the event in console & file log
          userAccess.end(); // end the log time function event
          userAccess.logT(
            `User ${req.session.user} Cleared all cached images from disk}`
          );
        }
      });
    } else {
      // if folder not exist return message that it has been cleared
      res.status(200).json({
        success: true,
        message: 'Cached Thumbnails already cleared !!'
      });
      // log the event in console & file log
      userAccess.end(); // end the log time function event
      userAccess.logT(
        `User ${req.session.user} Cached Thumbnails already cleared !!}`
      );
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      message: 'you have to log in to you dashboard first to can call this'
    });
  }

  return;
};

export default imageDeleteThumbs;
