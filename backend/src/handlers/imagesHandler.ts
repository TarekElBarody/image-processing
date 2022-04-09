import express from 'express';
import multer from 'multer';
import verifyTokens from '../lib/middleware/verifyTokens';
import imageFetch from '../lib/middleware/imageFetch';
import imageList from '../lib/middleware/imageList';
import imageListCount from '../lib/middleware/imageListCount';
import imageHistory from '../lib/middleware/imageHistory';
import imageDeleteThumbs from '../lib/middleware/imageDeleteThumbs';
import imageDeleteSelected from '../lib/middleware/imageDeleteSelected';
import uploadImages from '../lib/middleware/uploadImages';
import thumbFetch from '../lib/middleware/thumbFetch';

const imagesHandler = (apiRoute: express.Router) => {
  // Using api/images api Process Image tools

  // Using api/list api to get Image list
  apiRoute.get('/images/list', verifyTokens, imageList);

  // Using api/list/count api to get Image in folder count
  apiRoute.get('/images/count', verifyTokens, imageListCount);

  // Using api/images/history api to get images processing history list
  apiRoute.get('/images/history', verifyTokens, imageHistory);

  // Using api/images/delete/thumbs api to delete all cached thumbs
  apiRoute.post('/images/delete/thumbs', verifyTokens, imageDeleteThumbs);

  // Using api/images/delete/selected api to delete selected full images
  apiRoute.post('/images/delete/selected', verifyTokens, imageDeleteSelected);

  // Using multer module to handel upload images to the tmp directory
  const upload = multer({ dest: './images/tmp' });

  // Using api/upload
  apiRoute.post(
    '/images/upload',
    verifyTokens,
    upload.single('photo'),
    uploadImages
  );

  apiRoute.get('/images/thumb/:filename', thumbFetch);
  apiRoute.get('/images/:filename', imageFetch);
};

export default imagesHandler;
