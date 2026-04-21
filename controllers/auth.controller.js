import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {sendVerificationEmail} from "../utils/sendEmail.js";
import crypto from "crypto";
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role, location, about } =
      req.body;
    // if (
    //   !fullName ||
    //   !email ||
    //   !password ||
    //   !role ||
    //   !phoneNumber ||
    //   !location
    // ) {
    //   return res.status(400).json({
    //     message: "All required fields missing",
    //     success: false,
    //   });
    // }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({
        message: "user alerady exist with this email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phoneNumber,
      location,
      about,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
    });
    await sendVerificationEmail(email, verificationToken);
    return res.status(201).json({
      message:
        "Account created! Please check your email to verify your account.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All required fields missing",
        success: false,
      });
    }
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        message: "incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "incorrect email or password",
        success: false,
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first!",
        success: false,
      });
    }
    // const tokenData = {
    //   userId: user._id,
    // };
    if (!process.env.SECRET_KEY) {
      throw new Error("Secret key not configured");
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: `welcome back ${user.fullName}`,
        success: true,
        user,
        token
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const logOut = (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token", { httpOnly: true, sameSite: "none",  secure: true, })
      .json({
        message: "logout successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link.",
        success: false,
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // ✅ React frontend pe redirect
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(404).json({ message: "User not found", success: false });
    if (user.isVerified) return res.status(400).json({ message: "Email already verified", success: false });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    return res.status(200).json({ message: "Verification email resent!", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  return res.status(200).json({
    data: user,
  });
};

