require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = require("./src/index");
const swagger = require("./src/utils/swagger");

const connection = process.env.CONNECTION_STRING;

if (process.env.NODE_ENVIROMMENT === "development") {
  app.use(morgan("dev"));
  mongoose.set("debug", true);
}

mongoose
  .connect(connection, {})
  .then(() => {
    console.log("💪Database successfully connected💪");
  })
  .catch((err) => {
    console.error(err);
    return;
  });

// Start Server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
