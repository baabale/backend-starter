const mongoose = require("mongoose");

exports.createOne = (Model) => async (req, res, next) => {
  try {
    const data = await Model.create({ ...req.body, createdBy: req?.user?._id });
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    next(error);
  }
};

exports.createMany = (Model) => async (req, res, next) => {
  try {
    const reqBody = req.body.map((item) => ({
      ...item,
      createdBy: req.user._id,
    }));

    const data = await Model.insertMany(reqBody);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    deleteFile(req.images);
    next(error);
  }
};

exports.getAll = (Model) => async (req, res, next) => {
  try {
    let { query } = req.query;

    const data = await Model.find(query).lean();

    return res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};

exports.getOneById = (Model) => async (req, res, next) => {
  try {
    const data = await Model.findById(req.params.id).populate(populate);
    if (data) return res.status(200).json({ status: "success", data });

    res.status(404).json({ status: "fail", message: "Document not found" });
  } catch (error) {
    next(error);
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const data = await Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ status: "success", data });
  } catch (error) {
    deleteFile(req.images);
    next(error);
  }
};

exports.updateMany = (Model) => async (req, res, next) => {
  try {
    const data = await Model.updateMany(
      req.params.id,
      { ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ status: "success", data });
  } catch (error) {
    deleteFile(req.images);
    next(error);
  }
};

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data)
      return res
        .status(404)
        .json({ status: "fail", message: "Document does not exist" });

    res.status(204).json({ status: "success", message: "Document deleted" });
  } catch (error) {
    next(error);
  }
};

exports.deleteMany = (Model) => async (req, res, next) => {
  try {
    const data = await Model.deleteMany(req.body || {});

    if (!data) {
      return res
        .status(204)
        .json({ status: "fail", message: "Document does not exist" });
    }

    res.status(204).json({ status: "success", message: "Document deleted" });
  } catch (error) {
    next(error);
  }
};
