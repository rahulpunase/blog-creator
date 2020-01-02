import express from 'express';
import 'babel-polyfill';
import { userController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/register', [], userController.register);

export default userRouter;