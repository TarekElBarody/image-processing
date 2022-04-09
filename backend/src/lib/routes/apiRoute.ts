import express from 'express';
import usersHandler from '../../handlers/usersHandler';
import imagesHandler from '../../handlers/imagesHandler';

// Configure API Routes
const apiRoute = express.Router();

usersHandler(apiRoute);

imagesHandler(apiRoute);

// set api/ to be the main route and provide instruction message
apiRoute.get('/', (_req: express.Request, res: express.Response): void => {
  res.status(200).json({
    message:
      'This is the API main page .. please read the API documentation for more help'
  });
});

// Set up JSON error message for invalid or not exists api routes
apiRoute.use((_req: express.Request, res: express.Response): void => {
  res.status(404).json({
    message: 'API Page Not Found !.'
  });
});

export default apiRoute;
