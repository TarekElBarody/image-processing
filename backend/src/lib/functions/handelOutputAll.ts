import express from 'express';
import { FilePaths, ImageRequest } from '../../types/ImageRequest';
import logger from './logger';
import ThumbStore from '../../models/thumbStore';
import dotenv from 'dotenv';

dotenv.config();
const thumbStore = new ThumbStore();

const handelOutputAll = async (
  _req: express.Request,
  res: express.Response,
  pathNames: FilePaths,
  imageReq: ImageRequest,
  imageLog: logger
): Promise<void> => {
  // get all thumb images for the original image with the same name
  const getThumbFiles = await thumbStore.index(
    pathNames.fullImage?.id as string
  );
  // get all thumbs images metadata

  const fetchThumbs = [];

  for (let i = 0; i < getThumbFiles.length; i++) {
    const thumbFileName = `${getThumbFiles[i].filename}`;

    fetchThumbs.push({
      id: getThumbFiles[i].id,
      image_id: getThumbFiles[i].image_id,
      url: `https://${
        process.env.AWS_CLOUD_FRONT || ''
      }/api/images/thumb/${thumbFileName}`,
      width: getThumbFiles[i].width,
      height: getThumbFiles[i].height,
      format: getThumbFiles[i].format,
      fit: getThumbFiles[i].fit,
      last_modified: getThumbFiles[i].modified
    });
  }

  //prepare the json output for all thumbs
  const PrepThumbs = {
    id: pathNames.fullImage?.id,
    user_id: pathNames.fullImage?.user_id,
    width: pathNames.fullImage?.width,
    height: pathNames.fullImage?.height,
    created: pathNames.fullImage?.created,
    access: pathNames.fullImage?.access,
    url: `https://${process.env.AWS_CLOUD_FRONT || ''}/api/images/${
      pathNames.fullImage?.filename
    }`,
    thumbs: fetchThumbs
  };

  // send the json to the user
  res.status(200).json(PrepThumbs);

  // log the event in console & file log
  imageLog.end(); // end the log time function event
  imageLog.logT(`Output all thumbs for image name ${imageReq.filename}`);
  return;
};

export default handelOutputAll;
