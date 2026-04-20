import express from 'express'
import { getMe, loginUser, logOut, registerUser } from '../controllers/auth.controller.js';
import { loginValidation, registerValidation } from '../middleware/validation.middleware.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import {resendVerification} from "../controllers/auth.controller.js"
import {verifyEmail} from "../controllers/auth.controller.js"
import {authLimiter, generalLimiter, resendEmailLimiter} from "../middleware/rateLimiter.js"
const router = express.Router();
router.use(generalLimiter);
router.post("/register",authLimiter,registerValidation,registerUser)
router.post("/login",authLimiter,loginValidation,loginUser)
router.get("/confirm-email", verifyEmail);
router.post("/resend-verification",resendEmailLimiter, resendVerification);
router.post("/logout",logOut)
router.get("/me",isAuthenticated,getMe)

export default router;