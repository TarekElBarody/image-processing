import { ImageRequest, FilePaths } from '../../types/ImageRequest';
import ImageStore from '../../models/imageStore';
import ThumbStore from '../../models/thumbStore';
import dotenv from 'dotenv';

dotenv.config();

const imageStore = new ImageStore();
const thumbStore = new ThumbStore();

const getPathName = async (imageRequest: ImageRequest): Promise<FilePaths> => {
  // set path name resolver
  const thumbDir =
    process.env.ENV == 'production' ? 'upload/thumb' : 'test/thumb';
  const fullDire =
    process.env.ENV == 'production' ? 'upload/full' : 'test/full';
  try {
    const image = await imageStore.find(imageRequest.filename);
    if (image.id) {
      let toWidth = imageRequest.width == 0 ? image.width : imageRequest.width; // set the original width as default
      let toHeight =
        imageRequest.height == 0 ? image.height : imageRequest.height; // set the original height as default

      if (toWidth != image.width && toHeight == image.height) {
        toHeight = parseInt(
          ((toWidth * image.height) / image.width).toFixed(0)
        );
      } else if (toWidth == image.width && toHeight != image.height) {
        toWidth = parseInt(
          ((toHeight * image.width) / image.height).toFixed(0)
        );
      }
      const findThumb = {
        image_id: image.id,
        width: toWidth,
        height: toHeight,
        ext: imageRequest.filename.split('.')[1],
        format: imageRequest.format,
        fit: imageRequest.fit
      };

      const thumb = await thumbStore.find(findThumb);

      const filePaths: FilePaths = {
        fullDir: fullDire,
        thumbDir: thumbDir,
        fullImage: image,
        thumbImage: thumb,
        success: true,
        error: ''
      };
      return filePaths; // return the paths array
    } else {
      const filePaths: FilePaths = {
        fullDir: fullDire,
        thumbDir: thumbDir,
        fullImage: undefined,
        thumbImage: undefined,
        success: false,
        error: 'Cannot find Image file'
      };
      return filePaths; // return the paths array
    }
  } catch (error) {
    const filePaths: FilePaths = {
      fullDir: fullDire,
      thumbDir: thumbDir,
      fullImage: undefined,
      thumbImage: undefined,
      success: false,
      error: error as string
    };
    return filePaths; // return the paths array
  }

  // sett array with paths information
};

export default getPathName;
