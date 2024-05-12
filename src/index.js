const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const ErrorHandler = require("./utils/error");

const app = express();
const path = require("path");

app.use(cors());
app.use(express.json({ limit: process.env.REQUEST_LIMIT || "50mb" }));
app.use(express.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || "50mb" }));
app.use(mongoSanitize());

app.use(express.static(path.join(__dirname + "/../public/")));

app.use("/uploads", express.static("public/upload/"));

// Customer Route
const injectUserRoutes = require("./users");
injectUserRoutes(app);


// Initialize Swagger
const swagger = require("./utils/swagger");
swagger(app)

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Page Not Found!",
  });
});

app.use(ErrorHandler);

module.exports = app;
