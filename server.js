const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({
  path: "./config.env",
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.set("strictQuery", false);
mongoose.connect(DB).then((con) => {
  console.log("URA!🎈");
});

const app = require("./app");

const port = 8080;
app.listen(process.env.PORT || port, () => {
  console.log(`App running on port ${port}`);
});
