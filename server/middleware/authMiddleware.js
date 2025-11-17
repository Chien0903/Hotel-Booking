import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  const { userId } = req.auth;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  } else {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User not found in database. Please complete signup or try again later.",
      });
    }
    req.user = user;
    next();
  }
};
