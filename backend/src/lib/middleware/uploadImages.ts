import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import express from 'express';
import logger from '../functions/logger';
import safeString from '../functions/safeString';
import { FileUpload } from '../../types/fileUpload';
import ImageStore from '../../models/imageStore';
import s3Client from '../functions/s3Client';
import { randomUUID } from 'crypto';
import { dateNow } from '../functions/general';
import { Image } from '../../types/index';
import dotenv from 'dotenv';

dotenv.config();
const fullDire = process.env.ENV == 'production' ? 'upload/full' : 'test/full';

const imageStore = new ImageStore();
const s3 = new s3Client();

const uploadImages = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // bypass login and create test login for jasmine
  // bypass login and create test login for jasmine

  // if user logged in
  if (req.session.user && req.session.isToken === true) {
    // configure logger to use imageProcess.log file
    const userAccess = new logger('userAccess');
    userAccess.start(); // start the log time function event

    // set full & thumb dir paths
    let pathDir = '';

    // resolve tmp dir for uploading
    pathDir = path.resolve('./images/tmp');
    if (!fs.existsSync(pathDir)) {
      fs.mkdirSync(pathDir);
    }

    try {
      // set file type to pass file uploaded information
      const file = req.file as FileUpload;
      if (file.filename) {
        // if file is uploaded and have data get information
        const id = randomUUID();
        const fileName = safeString(path.parse(file.originalname).name);
        const fileExt = path.parse(file.originalname).ext;
        const fileSrc = path.join(file.destination, file.filename);
        const fileDist = path.join('./images/full', fileName + fileExt);

        fs.copyFileSync(fileSrc, fileDist);
        if (fs.existsSync(fileDist)) {
          const FullProps = await sharp(fileDist).metadata();
          const contentType = 'image/' + FullProps.format;
          const disName =
            id.split('-').join('') +
            '_' +
            req.session.user.id.split('-').join('') +
            '.' +
            FullProps.format;

          const image: Image = {
            id: id,
            user_id: req.session.user.id,
            filename: disName,
            width: FullProps.width as number,
            height: FullProps.height as number,
            created: dateNow(),
            bucket_key: fullDire + '/' + disName,
            access: Number(req.body.access) || 2
          };

          const imageRes = await imageStore.create(image);

          const fileContent = fs.readFileSync(fileDist);

          const s3Res = await s3.addToBucket(
            imageRes.bucket_key as string,
            fileContent,
            contentType
          );

          if (s3Res.success) {
            fs.unlinkSync(fileSrc); // deleted tmp file if copy to full success
            fs.unlinkSync(fileDist); // deleted tmp file if copy to full success
            res.status(200).json({
              status: 'success',
              message: `File Uploaded successfully`,
              image: `//${process.env.AWS_CLOUD_FRONT}/api/images/${disName}`
            });

            userAccess.end(); // end the log time function event
            userAccess.logT(
              `User ${req.session.user} File Uploaded successfully`
            );
          } else {
            await imageStore.delete(image.id);
            res.status(409).json({
              status: 'error',
              message: `Cannot Upload the Image to The Bucket`
            });
            userAccess.end(); // end the log time function event
            userAccess.logT(
              `User ${req.session.user} Cannot Upload the Image to The Bucket`
            );
            return;
          }
        } else {
          // if copy fails to full dir send error 400
          res.status(409).json({
            status: 'error',
            message: `Cannot Access File after uploaded`
          });
          userAccess.end(); // end the log time function event
          userAccess.logT(
            `User ${req.session.user} Cannot Access File after uploaded`
          );
          return;
        }
      } else {
        // if their is no file uploaded return 400 error
        res.status(400).json({
          status: 'error',
          message: `No File uploaded`
        });
        userAccess.end(); // end the log time function event
        userAccess.logT(`User ${req.session.user} No File uploaded`);
        return;
      }
    } catch (error) {
      //if catch error send error 400
      const err = error as string;
      res.status(409).json({
        status: 'error',
        message: err
      });
      userAccess.end(); // end the log time function event
      userAccess.logT(`User ${req.session.user} upload catch error ${err}`);
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

export default uploadImages;
