import rateLimit from "express-rate-limit";

// General API limit
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes."
  }
});

// Auth routes ke liye strict limit
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // sirf 10 tries
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes."
  }
});

// Resend email ke liye
export const resendEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // sirf 3 baar resend
  message: {
    success: false,
    message: "Too many resend attempts, please try again after 1 hour."
  }
});
export const updateProfileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 15 min mein sirf 10 baar update
  message: {
    success: false,
    message: "Too many update attempts, please try again after 15 minutes."
  }
});