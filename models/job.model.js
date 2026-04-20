import mongoose, { Mongoose } from "mongoose";
import JOB_CATEGORIES from "../constants/jobCategories.js";
import { JOB_TYPES } from "../constants/jobTypes.js";
// import { User } from "./user.model.js";
// import { application } from "express";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobCategory: {
      type: String,
      enum: JOB_CATEGORIES,
      required: true,
    },
    jobType: {
      type: String,
      enum: JOB_TYPES,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    numberOpening: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },

    responsibilities: {
      type: [String],
      trim: true,
      required: true,
    },

    requirements: {
      type: [String],
      trim: true,
      required: true,
    },
    // qualification: [
    //   {
    //     type: String,
    //     trim: true,
    //     required: true,
    //   },
    // ],
    ExperienceLevel: {
      type: String,
      enum: [
        "Intern",
        "Entry-Level (0-1 years)",
        "Junior (1-3 years)",
        "Mid-Level (3-5 years)",
        "Senior (5-10 years)",
        "Lead / Manager (10+ years)",
      ],
      required: true,
    },
    EducationRequirement: {
      type: String,
      enum: [
        "High School / Secondary",
        "Diploma / Associate Degree",
        "Bachelor’s Degree",
        "Master’s Degree",
        "PhD / Doctorate",
        "Certification / Professional Training",
        "Any",
      ],
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    MinimumSalary: {
      type: Number,
      required: true,
    },
    MaximumSalary: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["PKR", "USD", "EUR", "GBP", "AED", "INR"],
    },
    perks: {
      type: [String],
      default: [],
      required: true,
    },
    workSchedule: {
      type: String,
      enum: [
        "Day shift",
        "Night shift",
        "Flexible",
        "Shift work",
        "Remote",
        "Hybrid",
      ],
      required: true,
    },
    applyMethod: {
      type: String,
      enum: ["platform", "external"],
      required: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    // created_by:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:company,
    //     required:true,
    // },
  },

  { timestamps: true },
);

export const Job = mongoose.model("Job", jobSchema);
