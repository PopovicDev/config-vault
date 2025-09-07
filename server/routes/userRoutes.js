import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, getUserProfile, getAllUsers, addFollower, removeFollower, getAllGames, getConfigPreset, saveConfig, getOwnConfigs, editConfig, deleteConfig, getConfigs, showConfig } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/profile-data/:username', userAuth, getUserProfile);
userRouter.get('/all-users', userAuth, getAllUsers)
userRouter.post('/addFollower', userAuth, addFollower);
userRouter.post('/removeFollower', userAuth, removeFollower);
userRouter.get('/all-games', userAuth, getAllGames);
userRouter.get('/cfgpreset', userAuth, getConfigPreset);
userRouter.post('/saveconfig', userAuth, saveConfig);
userRouter.get('/getOwnConfigs', userAuth, getOwnConfigs);
userRouter.post('/editconfig', userAuth, editConfig);
userRouter.post('/deleteconfig', userAuth, deleteConfig);
userRouter.post('/getConfigs', userAuth, getConfigs);
userRouter.post('/showConfig', userAuth, showConfig);

export default userRouter;