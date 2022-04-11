import sharp from 'sharp';
import express from 'express';
import { FilePaths, ImageRequest } from '../../types/ImageRequest';
import getPathName from '../functions/getPathName';
import logger from '../functions/logger';
import safeString from '../functions/safeString';
import handelOutputAll from '../functions/handelOutputAll';
import handelCachedThumb from '../functions/handelCachedThumb';
import s3Client from '../functions/s3Client';
import { Image, Thumb } from '../../types/index';
import ThumbStore from '../../models/thumbStore';
import { randomUUID } from 'crypto';
import { dateNow } from '../functions/general';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const thumbStore = new ThumbStore();
const s3 = new s3Client();

const imageFetch = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // get Jasmine test variables (noConsole)
  const imageLog = new logger('imageProcess');
  imageLog.start(); // start the log time function event
  try {
    const outPut = ['img', 'json', 'all'];
    // getting user query option for processing image
    const fileNamePattern = /\.(gif|jpe?g|tiff?|png|webp|jp2|avif|heif)$/i.test(
      req.params.filename as string
    )
      ? (req.params.filename as string)
      : '';
    if (fileNamePattern === '') {
      res.status(400).json({
        message: 'Error processing image No file name provided'
      });
      // log the error
      imageLog.log(`Error processing image No file name provided `);
      return;
    }
    const extArray = fileNamePattern.split('.');
    const ext = extArray[extArray.length - 1];

    const imageReq: ImageRequest = {
      filename: fileNamePattern, // default to empty string using safeString to Safe Pass File names
      width: parseInt(req.query.width as string) || 0, // Default to 0 mean the original width of the image
      height: parseInt(req.query.height as string) || 0, // Default to 0 mean the original height  of the image
      format: safeString((req.query.format as string) || ext), // jpeg  png webp gif jp2 tiff avif heif raw Default is jpg
      fit: safeString(req.query.fit as string) || 'cover', // cover, contain, fill, inside or outside., default 'fill'
      catching: parseInt(req.query.catching as string) != 0 ? 1 : 0, // 0=off , 1=on default is on = 1
      out:
        outPut.includes(safeString(req.query.out as string)) == true
          ? safeString(req.query.out as string)
          : 'img' // use img. json or all output process, default 'img'
    };
    // get the full path & thumb path by providing image properties
    let pathNames: FilePaths;
    if (imageReq.filename != '') {
      // check  if user provide a file name
      pathNames = await getPathName(imageReq); // generate image full and thumb path
    } else {
      // if not return a json error message
      res.status(400).json({
        message: 'Error processing image No file name provided'
      });
      // log the error
      imageLog.log(`Error processing image No file name provided `);
      return;
    }

    if (pathNames.success != true) {
      res.status(400).json({
        message: `Error processing image ${pathNames.error}`
      });
      // log the error
      imageLog.log(
        `Error processing image No file name provided ${pathNames.error}`
      );
      return;
    }
    // if user provide the out=all parameter
    if (imageReq.out == 'all') {
      // call the handler for output all
      await handelOutputAll(req, res, pathNames, imageReq, imageLog);
      return;
    }

    // check if the thumb exists then serve the cached thumb
    if (pathNames.thumbImage != undefined) {
      // call the handler for serve cached thumb
      await handelCachedThumb(req, res, pathNames, imageReq, imageLog);
      return;
    }

    const fullImage = pathNames.fullImage as Image;

    const url = `https://${process.env.AWS_CLOUD_FRONT_BUCKET}/${pathNames.fullDir}/${fullImage.filename}`;
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    // check if the full image path exists to process image resize
    if (
      response.status === 200 ||
      response.status === 204 ||
      response.status === 302
    ) {
      // get original file properties
      const buffer = Buffer.from(response.data, 'utf-8');

      let toWidth = imageReq.width == 0 ? fullImage.width : imageReq.width; // set the original width as default
      let toHeight = imageReq.height == 0 ? fullImage.height : imageReq.height; // set the original height as default

      if (toWidth != fullImage.width && toHeight == fullImage.height) {
        toHeight = parseInt(
          ((toWidth * fullImage.height) / fullImage.width).toFixed(0)
        );
      } else if (toWidth == fullImage.width && toHeight != fullImage.height) {
        toWidth = parseInt(
          ((toHeight * fullImage.width) / fullImage.height).toFixed(0)
        );
      }
      // call the imageResize class for image resize process
      const imageFit = (fit: string) => {
        switch (fit) {
          case 'fill':
            return sharp.fit.fill;
          case 'cover':
            return sharp.fit.cover;
          case 'inside':
            return sharp.fit.inside;
          case 'outside':
            return sharp.fit.outside;
          case 'contain':
            return sharp.fit.contain;
        }
        return sharp.fit.fill; // default os fill
      };

      const resizedImage = await sharp(buffer)
        .resize(toWidth, toHeight, {
          fit: imageFit(imageReq.fit)
        }) // user input for width & height
        .toFormat(imageReq.format as unknown as sharp.AvailableFormatInfo) // user provider output format
        .toBuffer(); // processing resizing

      const info = await sharp(resizedImage).metadata();

      const thumbID = randomUUID();
      const thumbFileName = `${thumbID.split('-').join('')}_${fullImage.id
        .split('-')
        .join('')}_${toWidth}_${toHeight}_${info.format}_${imageReq.fit}.${
        info.format
      }`;
      if (resizedImage) {
        const s3Res = await s3.addToBucket(
          `${pathNames.thumbDir}/${thumbFileName}`,
          resizedImage,
          'image/' + info.format
        );

        if (s3Res.success === true) {
          const insertThumb: Thumb = {
            id: thumbID,
            image_id: fullImage.id,
            filename: thumbFileName,
            width: toWidth,
            height: toHeight,
            format: info.format as string,
            fit: imageReq.fit,
            modified: dateNow(),
            bucket_key: s3Res.data?.Key as string
          };

          const newThumb = await thumbStore.create(insertThumb);
          // if true check the out put
          if (newThumb.id) {
            if (imageReq.out === 'json') {
              const thumbJson = {
                status: true,
                id: fullImage.id,
                user_id: fullImage.user_id,
                width: fullImage.width,
                height: fullImage.height,
                created: fullImage.created,
                access: fullImage.access,
                url: `https://${
                  process.env.AWS_CLOUD_FRONT_SERVER || ''
                }/api/images/${fullImage.filename}`,
                thumb: {
                  id: newThumb.id,
                  image_id: newThumb.image_id,
                  user_id: fullImage.user_id,
                  url: `https://${
                    process.env.AWS_CLOUD_FRONT_SERVER || ''
                  }/api/images/thumb/${thumbFileName}`,
                  width: newThumb.width,
                  height: newThumb.height,
                  format: newThumb.format,
                  fit: newThumb.fit
                }
              };
              // if json return generated json data from the class to the user
              res.status(200).json(thumbJson);
              imageLog.end();
              imageLog.logT(
                `Success processing image & Fetched as JSON for image ${imageReq.filename}  to format ${info.format} with width ${info.width} & height ${info.height}`
              );
              return;
            } else if (imageReq.out === 'img') {
              // if img return send the resized file back to the user
              res.header('Cache-Control', 'max-age=31536000');
              res
                .contentType('image/' + info.format)
                .status(200)
                .send(resizedImage);
              imageLog.end();
              imageLog.log(
                `Success processing thumb for image ${imageReq.filename} to format ${info.format} with width ${info.width} & height ${info.height}`
              );
              return;
            }
          } else {
            res.status(400).json({
              message: 'Error Processing cannot process image resize'
            });
            imageLog.end();
            imageLog.logT('Error Processing cannot process image resize');
            return;
          }
        } else {
          // if status not true then send json with the error message
          res.status(400).json({ message: s3Res.err });
          // log the event in console & file log
          imageLog.end();
          imageLog.logT(s3Res.err);
          return;
        }
      } else {
        // if the status is undefined return an error message
        res
          .status(400)
          .json({ message: 'Error Processing Resize for Requested Data' });
        // log the event in console & file log
        imageLog.end();
        imageLog.logT('Error Processing Resize for Requested Data!');
        return;
      }
    } else {
      // if file path not exist fetch 404 json message
      res.status(404).json({
        message: 'Cannot Get File From Storage !.'
      });
      // log the event in console & file log
      imageLog.end();
      imageLog.logT('Cannot Get File From Storage !.');
      return;
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error Processing Image for Requested Data' });
    imageLog.end();
    imageLog.logT('Error Processing Image for Requested Data!');
    return;
  }
  // configure logger to use imageProcess.log file
};

export default imageFetch;
