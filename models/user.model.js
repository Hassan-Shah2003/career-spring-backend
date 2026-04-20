import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["job Seeker", "company"],
      default: "job Seeker",
      required: true,
    },
    companyName: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      // required:true,
      maxlength: 500,
      required: true,
    },
    profile: {
      age: {
        type: Number,
        default: null,
      },
      title: {
        type: String,
        default: "",
      },
      tagline: {
        type: String,
        default: "",
      },
      resume: {
        type: String,
        default: "",
      },
      profilePhoto: {
        type: String,
        default: "",
      },
      resumeOrignalName: {
        type: String,
        default: "",
      },
      skills: {
        type: [String],
        default: [],
      },
      experience: [
        {
          position: {
            type: String,
            default: "",
          },
          company: {
            type: String,
            default: "",
          },
          period: {
            type: String,
            default: "",
          },
          description: {
            type: String,
            default: "",
          },
        },
      ],
      education: [
        {
          institute: {
            type: String,
            default: "",
          },
          degree: {
            type: String,
            default: "",
          },
          year: {
            type: String,
            default: "",
          },
          description: {
            type: String,
            default: "",
          },
          grade: {
            type: String,
            default: "",
          },
        },
      ],

      // company:{
      //     type:mongoose.Schema.Types.ObjectId,ref:"Company",
      // },
    },
    companyProfile: {
      // companyName: { type: String, default: "" },
      website: { type: String, default: "" },
      industry: { type: String, default: "" },
      companySize: {
        type: String,
        default: "",
      },
      mission: { type: String, default: "" },
      vision: { type: String, default: "" },
      foundedYear: {
        type: String,
        default: "",
      },
      socialLinks: {
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        facebook: { type: String, default: "" },
      },
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
