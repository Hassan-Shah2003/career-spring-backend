import express from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { profileValidation } from "../middleware/profile.validation.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { generalLimiter, updateProfileLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
router.use(generalLimiter)
router.get("/profile", isAuthenticated, getProfile);
router.put(
  "/profile/update",
  updateProfileLimiter,
  isAuthenticated,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 }, // for profile image
    { name: "resume", maxCount: 1 },
  ]),
  profileValidation,
  updateProfile,
);
export default router;
