import express from 'express';
import 'babel-polyfill';
import { userController } from '../controllers/user.controller';
import { loggerAsMiddleware } from '../util/logger.factory';

const userRouter = express.Router();

userRouter.post('/register', [loggerAsMiddleware], userController.register);

userRouter.post('/login', [loggerAsMiddleware], userController.loginUser);

export default userRouter;