const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(403).json({
        error: "Masukkan token terlebih dahulu",
      });
    }

    if (token.toLowerCase().startsWith("bearer")) {
      token = token.slice("bearer".length).trim();
    }

    const jwtPayload = jwt.verify(token, "secretKey");

    if (!jwtPayload) {
      return res.status(403).json({
        error: "Belum login",
      });
    }

    req.user = {
      ...jwtPayload,
      userId: jwtPayload.userId,
    };
    req.userRole = jwtPayload.role;
    next();
  } catch (error) {
    return res.status(403).json({
      error,
    });
  }
};

module.exports = checkToken;
