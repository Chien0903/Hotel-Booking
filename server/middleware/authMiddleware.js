import User from "../models/User.js";

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    const userId = req.auth?.userId; // guard against undefined req.auth

    if (!userId) {
      // helpful debug log for missing auth during development
      console.warn(
        "protect middleware: missing req.auth.userId; request headers:",
        Object.keys(req.headers)
      );
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

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
  } catch (error) {
    console.error("Error in protect middleware:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error in authentication" });
  }
};
