import fs from 'fs';
import path from 'path';
import express from 'express';
import logger from '../functions/logger';

const imageHistory = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // get Jasmine test variables (jasmine token
  // bypass login and create test login for jasmine

  if (req.session.user && req.session.isToken === true) {
    // configure logger to use userAccess.log file
    const userAccess = new logger('userAccess');
    userAccess.start(); // start the log time function event

    // resolve imageProcess.log path
    const imageProcess = path.resolve('./logs/imageProcess.log');

    // get image process history from imageProcess log file
    if (fs.existsSync(imageProcess)) {
      const historyData = fs
        .readFileSync(imageProcess, 'utf-8')
        .split('\n') // split every line of the array
        .filter((n) => n); // remove any empty lines

      const history: (string | number | object)[] = [];
      // loop to arrange and fetch array data
      let counter = 0;

      for (let i = historyData.length - 1; i >= 2 && counter <= 10000; i -= 2) {
        counter++;
        const innerData = historyData[i].split('  Process Duration : ');
        const time = innerData[0];
        const duration = (parseInt(innerData[1]) || 0) + 'ms';
        // push new result to  the history array
        history.push({
          num: counter,
          time: time,
          duration: duration,
          process: historyData[i - 1]
        });
      }
      // send the history json data to the user
      const DataTable = { data: history };
      res.status(200).json(DataTable);

      // log the event in console & file log
      userAccess.end(); // end the log time function event
      userAccess.logT(
        `User ${req.session.user} get Image Process History list`
      );
    } else {
      // if file not exists return no history
      res.status(200).json({
        data: [],
        message: 'no history detected'
      });
    }
  } else {
    // if user not logged in return an error message
    res.status(401).json({
      data: [],
      message: 'you have to log in to your dashboard first to can call this'
    });
  }

  return;
};

export default imageHistory;
