import { body, validationResult } from "express-validator";

export const profileValidation = [
  body("fullName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),

  body("email").optional().isEmail().withMessage("Invalid email format"),

  body("phoneNumber").optional().isString().withMessage("Phone must be string"),

  body("location").optional().isString(),

  body("age").optional().isNumeric().withMessage("Age must be number").custom((value)=>{
    if(value<13||value>100){
      throw new Error("Age must be between 13 and 120")
    }
  }),

  body("about")
    .optional()
    .isLength({ max: 500 })
    .withMessage("About cannot exceed 500 characters"),

  body("tagline").optional().isString(),

  body("title").optional().isString(),

  body("skills")
    .optional()
    .custom((value) => {
      if (value && typeof value != "string" && !Array.isArray(value)) {
        throw new Error("Skills must be string or array");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        succes: false,
        errors:errors.array()
      });
    }
    next()
  },
];
