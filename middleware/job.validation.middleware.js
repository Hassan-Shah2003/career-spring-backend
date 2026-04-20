import { body, validationResult } from "express-validator";
import JOB_CATEGORIES from "../constants/jobCategories.js";
import {JOB_TYPES} from "../constants/jobTypes.js";
const jobCreateValidation = [
  body("jobTitle")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ min: 3, max: 100 }),
  body("jobCategory")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(JOB_CATEGORIES)
    .withMessage("Invalid category"),
  body("jobType").notEmpty().isIn(JOB_TYPES).withMessage("Invalid job type"),
  body("location").trim().notEmpty().isLength({ max: 100 }),
  body("numberOpening")
    .isInt({ min: 1, max: 500 })
    .withMessage("Invalid number of openings"),
  body("description")
    .trim()
    .isLength({min:30})
    .withMessage("Description should be at least 30 characters long"),
    body("responsibilities")
    .isArray({ min: 1 })
    .withMessage("At least one responsibility is required"),
  body("requirements")
    .isArray({ min: 1 })
    .withMessage("requirements is required"),
  body("ExperienceLevel").notEmpty(),
  body("EducationRequirement").notEmpty(),
  body("skills").isArray({ min: 1 }),

  body("MinimumSalary").isInt({ min: 1000 }),
  body("MaximumSalary")
    .isInt()
    .custom((value, { req }) => {
      if (value <= req.body.MinimumSalary) {
        throw new Error("Maximum salary must be greater than minimum salary");
      }
      return true;
    }),
  body("currency").notEmpty().isIn(["PKR", "USD", "EUR", "GBP", "AED", "INR"]),
  body("workSchedule").notEmpty(),
  body("perks")
  .isArray({min:1})
  .withMessage("Select at least one perk or benefit")
  .custom((arr)=>arr.every(item => typeof item==="string" && item.trim() !== ""))
  .withMessage("Each perk must be a non-empty string"),
  body("applyMethod").isIn(["platform", "external"]),
    body("visibility")
    .isBoolean()
    .withMessage("Visibility must be true or false"),
  body("contactEmail").notEmpty().isEmail(),
  body("deadline")
    .isISO8601()
    .custom((value) => {
      const inputDate=value.split("T")[0];
      const today = new Date().toISOString().split("T")[0];
      if (inputDate<today) {
        throw new Error("Deadline cannot be in the past");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];
export default jobCreateValidation;