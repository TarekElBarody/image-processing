import fs from 'fs';
import path from 'path';
import express from 'express';
import logger from '../functions/logger';

const imageDeleteSelected = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // get Jasmine test variables (jasmine token)
  // bypass login and create test login for jasmine

  // check if user is logged in
  if (req.session.user && req.session.isToken === true) {
    // get userAccess.log
    const userAccess = new logger('userAccess');
    userAccess.start(); // start the log time function event

    try {
      let successCount = 0; // count thumb that has been deleted
      let allCount = 0; // count for all thumbs selected

      // get selected files from query
      const files = req.body.selected as string[];
      // check if files have data
      if (files.length > 0) {
        //check if first node of files array is a string not string[]
        if (files[0].length == 1) {
          allCount = 1; // if true allCount is equal to 1 file
          // start process deleting the file
          const filePath = path.resolve('./images/full/' + files);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            if (!fs.existsSync(filePath)) successCount++; // increase count if success
          }
        } else {
          // if not get the allCount from files array length
          allCount = files.length;
          // loop in files array
          for (let i = 0; i < allCount; i++) {
            // start process delete every file in array
            const filePath = path.resolve('./images/full/' + files[i]);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              if (!fs.existsSync(filePath)) successCount++; // increase count if success
            }
          }
        }
        // check if allCount and successCount ar equal
        if (allCount == successCount) {
          res.status(200).json({
            success: true,
            message: 'All selected images has been deleted successfully'
          });
          // log the event in console & file log
          userAccess.end(); // end the log time function event
          userAccess.logT(
            `User ${req.session.user} All selected images has been deleted successfully`
          );
          return;
        } else if (allCount > successCount && successCount > 0) {
          res.status(200).json({
            success: false,
            message: `Some Images fails to be deleted!`
          });
          // log the event in console & file log
          userAccess.end(); // end the log time function event
          userAccess.logT(
            `User ${req.session.user} Some Images fails to be deleted!`
          );
          return;
        } else {
          res.status(409).json({
            success: false,
            message: 'Error .. No Images has been deleted!'
          });
          // log the event in console & file log
          userAccess.end(); // end the log time function event
          userAccess.logT(
            `User ${req.session.user} Error .. No Images has been deleted!}`
          );
          return;
        }
      } else {
        res.status(404).json({
          success: false,
          message: 'No Image has been provided to deleting !'
        });
        // log the event in console & file log
        userAccess.end(); // end the log time function event
        userAccess.logT(
          `User ${req.session.user} No Image has been provided to deleting !}`
        );
        return;
      }
    } catch (e) {
      // catch error process and return error message
      res.status(404).json({
        success: false,
        message: 'No Image has been provided to deleting !'
      });
      // log the event in console & file log
      userAccess.end(); // end the log time function event
      userAccess.logT(
        `User ${req.session.user} No Image has been provided to deleting !`
      );
      return;
    }
    return;
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      message: 'you have to log in to you dashboard first to call this'
    });
  }
};
export default imageDeleteSelected;
