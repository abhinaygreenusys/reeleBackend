const jwt = require("jsonwebtoken");

// Replace 'your-secret-key' with your actual secret key

const verifyJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.email = decoded.UserInfo.userEmail; // Add the decoded user information to the request object
    req.id = decoded.UserInfo.userId;
    // console.log({ userid: decoded.UserInfo.userId });
    next(); // Pass control to the next middleware
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyJWT;
