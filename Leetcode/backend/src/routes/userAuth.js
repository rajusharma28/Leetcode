import express from 'express';
import {register, login,logout, adminRegister,deleteProfile} from '../controllers/userAuthent.js';
import userMiddleware from "../middleware/userMiddleware.js";
import adminMiddleware from '../middleware/adminMiddleware.js';

const authRouter =  express.Router();

// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware ,adminRegister);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
authRouter.get('/check',userMiddleware,(req,res)=>{

    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id:req.result._id,
        role:req.result.role,
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})
// authRouter.get('/getProfile',getProfile);


export default authRouter;

// login
// logout
// GetProfile

