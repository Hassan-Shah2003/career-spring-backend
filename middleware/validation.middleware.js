import { body, validationResult } from "express-validator";

export const registerValidation = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
    body("about")
    .notEmpty()
    .isLength({min:6})
    .withMessage("about is required")
    ,
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["job Seeker", "company"])
    .withMessage("Invalid role"),
  body("phoneNumber").notEmpty().withMessage("phone number is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("companyName").custom((value, { req }) => {
    if (req.body.role === "company/recruiter") {
      if (!value || value.trim() === "") {
        throw new Error("Company name is required for recruiter");
      }
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

export const loginValidation = [
  body("email").notEmpty().isEmail().withMessage("Valid email required"),

  body("password").notEmpty().withMessage("Password required"),
  (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            errors:errors.array(),
        })
    };
    next();
  }
];
