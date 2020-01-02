import express from 'express';
import 'babel-polyfill';
import { startController } from '../controllers/start.controller';
import { loggerAsMiddleware } from '../util/logger.factory';

const startRouter = express.Router();

startRouter.get('/getcategories', [loggerAsMiddleware], startController.fetchCategories);

export default startRouter;