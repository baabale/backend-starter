const helper = require("./helper");
const mongoose = require("mongoose");
const { existsSync } = require("fs");
const path = require("path");
const { isObjEmpty, getModel } = require("./utils");
const { deleteFile } = require("../utils/helper");

exports.createOne = (Model) => async (req, res, next) => {
  try {
    const model =
      Model.prototype instanceof mongoose.Model
        ? Model
        : Model(req.user, "create");

    var data = await model.create({ ...req.body, createdBy: req.user._id });

    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    next(error);
  }
};

exports.createMany = (Model) => async (req, res, next) => {
  try {
    const model =
      Model.prototype instanceof mongoose.Model
        ? Model
        : Model(req.user, "create");

    var reqBody = req.body.map((item) => ({
      ...item,
      createdBy: req.user._id,
    }));

    var data = await model.insertMany(reqBody);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    deleteFile(req.images);
    next(error);
  }
};

exports.getAll = (Model) => async (req, res, next) => {
  try {
    const model =
      Model.prototype instanceof mongoose.Model
        ? Model
        : Model(req.user, "read");

    let { query, options } = isObjEmpty(req.body) ? req.query : req.body;
    query = { ...query, ...req.params };

    if (options && options.populate) {
      if (!Array.isArray(options.populate)) {
        return next(new Error("Populate should be an Array!"));
      }

      options.populate.forEach((element, index) => {
        if (!element.dir) {
          const err = new Error(
            `[Dir] should be declared in the element of [${index}]!`
          );
          return next(err);
        }
      });

      options.populate.forEach((element, index) => {
        var mainModel = getModel(req.user, element, index, next);

        var { populate: p } = options.populate[index];
        if (p) {
          var subModel = getModel(req.user, p, index, next);
          p = {
            ...p,
            model: subModel,
          };
          options.populate[index] = {
            ...options.populate[index],
            populate: p,
          };
        }

        options.populate[index] = {
          model: mainModel,
          ...options.populate[index],
        };
      });
    }

    var data = await model.paginate(query, options);

    return res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};
exports.getList = (Model, select) => async (req, res, next) => {
  try {
    const model =
      Model.prototype instanceof mongoose.Model
        ? Model
        : Model(req.user, "read");

    var data = await model.find().select(select);

    return res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};

exports.getOne = (Model) => async (req, res, next) => {
  try {
    const model =
      Model.prototype instanceof mongoose.Model
        ? Model
        : Model(req.user, "read");

    let { populate } = isObjEmpty(req.body) ? req.query : req.body;

    if (populate) {
      if (!Array.isArray(populate)) {
        return next(new Error("Populate should be an Array!"));
      }

      populate.forEach((element, index) => {
        if (!element.dir) {
          const err = new Error(
            `[Dir] should be declared in the element of [${index}]!`
          );
          return next(err);
        }
      });

      populate.forEach((element, index) => {
        const file = path.join(__dirname, `../${element.dir}/model.js`);

        if (!existsSync(file)) {
          const err = new Error(
            `This model [${element.dir}] in the index of [${index}] does not exist`
          );
          return next(err);
        }

        let modelName = require(file);

        populate[index] = {
          model:
            modelName.prototype instanceof mongoose.Model
              ? modelName
              : modelName(req.user, "read"),
          ...populate[index],
        };
      });
    }

    var data = await model.findById(req.params.id).populate(populate);
    if (data) return res.status(200).json({ status: "success", data });

    res.status(404).json({ status: "fail", message: "Document not found" });
  } catch (error) {
    next(error);
  }
};

exports.search = (Model) => async (req, res, next) => {
  try {
    const model =
      Model.prototype instanceof mongoose.Model
        ? Model
        : Model(req.user, "read");

    const limit = req.query.limit || 5;
    const field = req.query.field;
    const keyword = req.query.search;

    var data = await model.find({ field: keyword }).limit(limit);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const model =
      Model.prototype instanceof mongoose.Model
        ? Model
        : Model(req.user, "update");

    if (req.body.contacts) {
      req.body.contacts = JSON.parse(req.body.contacts);
    }
    if (req.body.location) {
      req.body.location = JSON.parse(req.body.location);
    }
    if (req.body.amenities) {
      req.body.amenities = req.body.amenities.split(",");
    }

    var data = await model.findByIdAndUpdate(
      req.params.id,
      { ...req.body, $push: { photos: req.images } },
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
    const model =
      Model.prototype instanceof mongoose.Model
        ? Model
        : Model(req.user, "update");

    var data = await model.updateMany(
      req.params.id,
      { ...req.body, $push: { photos: req.images } },
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
    const model =
      Model.prototype instanceof mongoose.Model
        ? Model
        : Model(req.user, "delete");

    var data = await model.findByIdAndDelete(req.params.id);

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
    const model =
      Model.prototype instanceof mongoose.Model
        ? Model
        : Model(req.user, "delete");

    var data = await model.deleteMany(req.body || {});

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
