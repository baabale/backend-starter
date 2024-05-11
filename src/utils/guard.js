const jwt = require("jsonwebtoken");
const User = require("../users/model");

exports.guard = async (req, res, next) => {
  try {
    let { authorization } = req.headers;

    if (!authorization || !authorization.split(" ")[1]) {
      return res.status(403).json({
        status: "fail",
        message: "You need to login to access!",
      });
    }

    const token = authorization.split(" ")[1];

    let decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData) {
      return res.status(403).json({
        status: "fail",
        message: "You need to login to access!",
      });
    }

    let user = await User()
      .findOne({ _id: decodedData._id })
      .exec();

    if (!user) {
      return res.status(403).json({
        status: "fail",
        message: "You need to login to access!",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        status: "fail",
        message:
          "This user is not active! Please, contact your system administrator.",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
