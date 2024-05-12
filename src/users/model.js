const mongoose = require("mongoose").default;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be at most 30 characters"],
      match: [/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters long"],
      select: false,
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    createdBy: { type: mongoose.mongo.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive", "suspended"],
    },
  },
  { versionKey: false, timestamps: true }
);

UserSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

UserSchema.methods.checkPassword = async function (
  currentPassword,
  originalPassword
) {
  return await bcrypt.compare(currentPassword, originalPassword);
};

UserSchema.methods.createToken = function (user) {
  const data = {
    _id: user._id,
    role: user.role,
  };
  const token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

UserSchema.methods.verifyToken = function () {
  const data = jwt.verify(token, process.env.JWT_SECRET);
  return data;
};

UserSchema.plugin(aggregatePaginate);

const User = mongoose.model("User", UserSchema);

module.exports = User;


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: ["admin", "user"]
 *         createdBy:
 *           type: string
 *         status:
 *           type: string
 *           enum: ["active", "inactive", "suspended"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         code:
 *           type: integer
 *           description: Error code
 *         status:
 *           type: integer
 *           description: HTTP status code
 */