import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, getUserProfile, getAllUsers, addFollower, removeFollower } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/profile-data/:username', userAuth, getUserProfile);
userRouter.get('/all-users', userAuth, getAllUsers)
userRouter.post('/addFollower', userAuth, addFollower);
userRouter.post('/removeFollower', userAuth, removeFollower);

export default userRouter;