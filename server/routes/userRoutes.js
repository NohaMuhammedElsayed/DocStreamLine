import express from 'express';
import { acceptConnectionRequest, discoverUsers, followUsers, getUserConnections, getUserData, sendConnectionRequest, unfollowUsers, updateUserData } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../configs/multer.js';


const userRouter = express.Router();

//Url or endpoint 
userRouter.get('/data', protect, getUserData);
userRouter.post('/update', upload.fields([{name:'profile',maxCount:1},{name:'cover',maxCount:1}]),
 protect, updateUserData);

 userRouter.post('/discover', protect, discoverUsers);
 userRouter.post('/follow', protect, followUsers);
 userRouter.post('/connect', protect, sendConnectionRequest);
 userRouter.post('/accept', protect, acceptConnectionRequest);
 userRouter.get('/connections', protect, getUserConnections);
 userRouter.post('/unfollow', protect, unfollowUsers);


 export default userRouter;



