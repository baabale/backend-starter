exports.login = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Implement Login here",
    });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Implement Register here",
    });
  } catch (err) {
    next(err);
  }
};
