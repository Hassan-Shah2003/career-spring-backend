import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const updateProfile = async (req, res) => {
  try {
    console.log(req.body, "REQ BODY 🔥");

    const userId = req.user.userId;
    const updateData = {};

    // =========================
    // ✅ PARSE DATA (IMPORTANT)
    // =========================
    let mainData = null;
    let profileData = null;
    let companyData = null;

    try {
      // Company wala main
      if (req.body.main) {
        mainData = JSON.parse(req.body.main);
      }

      // Seeker + Company profile
      if (req.body.profile) {
        profileData =
          typeof req.body.profile === "string"
            ? JSON.parse(req.body.profile)
            : req.body.profile;
      }
      // Company profile
      if (req.body.companyProfile) {
        companyData = JSON.parse(req.body.companyProfile);
      }
      
      console.log(mainData, "MAIN ✅");
      console.log(profileData, "PROFILE ✅");
      console.log(companyData, "COMPANY ✅");
    } catch (err) {
      console.log("Parse error ❌", err);
    }
    
    const finalProfile = profileData || mainData?.profile;
    // =========================
    // ✅ TOP LEVEL FIELDS
    // =========================
    const topFields = ["fullName", "email","companyName", "phoneNumber", "location", "about"];

    // 👉 Seeker direct fields
    topFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // 👉 Company mainData
    if (mainData) {
      topFields.forEach((field) => {
        if (mainData[field] !== undefined) {
          updateData[field] = mainData[field];
        }
      });
    }

    // =========================
    // ✅ PROFILE DATA (Seeker + Company)
    // =========================
    if (finalProfile) {
      const profileFields = ["age","tagline", "title"];

      profileFields.forEach((field) => {
        if (finalProfile[field] !== undefined) {
          updateData[`profile.${field}`] = finalProfile[field];
        }
      });

      // ✅ Skills
      if (finalProfile.skills !== undefined) {
        let skillArray = [];

        if (Array.isArray(finalProfile.skills)) {
          skillArray = finalProfile.skills
            .map((s) =>
              typeof s === "string" ? s.trim() : s.name?.trim()
            )
            .filter(Boolean);
        }

        updateData["profile.skills"] = skillArray;
      }

      // ✅ Education
      if (finalProfile.education !== undefined) {
        updateData["profile.education"] = finalProfile.education;
      }

      // ✅ Experience
      if (finalProfile.experience !== undefined) {
        updateData["profile.experience"] = finalProfile.experience;
      }
    }

    // =========================
    // ✅ COMPANY PROFILE
    // =========================
    if (companyData) {
      const companyFields = [
        "companySize",
        "foundedYear",
        "industry",
        "mission",
        "vision",
        "website",
      ];

      companyFields.forEach((field) => {
        if (companyData[field] !== undefined) {
          updateData[`companyProfile.${field}`] = companyData[field];
        }
      });

      // ✅ Social Links
      if (companyData.socialLinks) {
        Object.keys(companyData.socialLinks).forEach((key) => {
          updateData[`companyProfile.socialLinks.${key}`] =
            companyData.socialLinks[key];
        });
      }
    }

    // =========================
    // ✅ FILE UPLOADS
    // =========================
    if (req.files?.profilePhoto) {
      const file = req.files.profilePhoto[0];

      const result = await uploadToCloudinary(
        file.buffer,
        "job-portal/profileImages",
        file.mimetype
      );

      updateData["profile.profilePhoto"] = result.secure_url;
    }

    if (req.files?.resume) {
      const resumeFile = req.files.resume[0];

      const result = await uploadToCloudinary(
        resumeFile.buffer,
        "job-portal/resumes",
        resumeFile.mimetype
      );

      updateData["profile.resume"] = result.secure_url;
      updateData["profile.resumeOrignalName"] =
        resumeFile.originalname;
    }

    // =========================
    // ✅ UPDATE DATABASE
    // =========================
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(400).json({
        message: "user not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "profile update successfully",
      success: true,
      user,
    });

  } catch (error) {
    console.log("SERVER ERROR ❌", error);

    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    return res.status(200).json({
      message: "profile fetch successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
