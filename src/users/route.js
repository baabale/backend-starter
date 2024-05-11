const express = require("express");
const { guard } = require("../utils/guard");
const { login, register } = require("./auth");
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
} = require("./controller");

// User Authentication
router.post("/register", register);
router.post("/login", login);
router.get('/search/:keyword', searchUsers);

router.get("/", guard, getUsers);
router.post("/", guard, createUser);
router.get("/:id", guard, getUser);
router.patch("/:id", guard, updateUser);
router.delete("/:id", guard, deleteUser);


module.exports = router;
