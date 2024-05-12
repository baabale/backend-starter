const User = require("../users/model");
const base = require("../utils/base");

exports.createUser = base.createOne(User);

exports.createUsers = base.createMany(User);

exports.updateUser = base.updateOne(User);

exports.updateUsers = base.updateMany(User);

exports.deleteUser = base.deleteOne(User);

exports.deleteUsers = base.deleteMany(User);

exports.getUsers = base.getAll(User);

exports.getUser = base.getOneById(User);
