import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
  }
};

export const adminAuth = (req, res, next) => {
  userAuth(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden - Admin access only",
      });
    }

    next();
  });
};
