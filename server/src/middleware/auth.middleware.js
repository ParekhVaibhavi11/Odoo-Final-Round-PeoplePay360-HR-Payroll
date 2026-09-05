const { verifyAccessToken } = require("../utils/jwt");
const { findUserById } = require("../repositories/auth.repository");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = verifyAccessToken(token);

    const user = await findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Account is inactive",
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      roleId: user.role_id,
      role: user.role_name,
      mustChangePassword: user.must_change_password,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
}

module.exports = authenticate;