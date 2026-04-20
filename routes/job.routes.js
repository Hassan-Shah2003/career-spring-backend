import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  createJob,
  getAllJob,
  getJobById,
  getMyJobs,
  updateJobVisibility,
} from "../controllers/job.controller.js";
import jobCreateValidation from "../middleware/job.validation.middleware.js";
import { applyJobValidationResult } from "../middleware/applyJob.validator.js";
import {
  applyJob,
  checkUserApplied,
  getAppliedJobs,
  getCompanyApplications,
  getJobApplicantsCount,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
import { authorizedRole } from "../middleware/authorizeRole.middleware.js";
import upload from "../middleware/multer.middleware.js";
const router = express.Router();

router.post("/create",isAuthenticated, jobCreateValidation,createJob);
router.get("/get", getAllJob);
router.get("/myjobs", isAuthenticated, getMyJobs);

// applied jobs

router.get("/applied", isAuthenticated, getAppliedJobs);
router.get("/company/allapplications",isAuthenticated,authorizedRole("company"),getCompanyApplications)
// fetch jobapplicants count
router.get("/:jobId/checkapplication",isAuthenticated,checkUserApplied)
router.get("/company/applicants",isAuthenticated, getJobApplicantsCount);

// update the status

router.patch(
  "/application/:id/status",
  isAuthenticated,
  authorizedRole("company"),
  updateApplicationStatus,
);
// apply job router

router.post(
  "/:jobId/apply",
  isAuthenticated,
  upload.single("resume"),
  applyJobValidationResult,
  applyJob,
);
// get id by job
router.get("/:id", getJobById);
router.patch(`/:id/visibility`,isAuthenticated,updateJobVisibility)
export default router;
