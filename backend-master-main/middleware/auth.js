const jwt = require("jsonwebtoken");


exports.auth = (req, res, next) => {
  try {
    let token = null;

    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.body.token) {
      token = req.body.token;
    } else if (req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
        console.log(error);
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating",
    });
  }
};
