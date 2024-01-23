require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 1234;
const path = require("path");
const morgan = require("morgan");

const router = require("./routers/index");

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ strict: false }));
app.use(morgan("dev"));
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST');
  res.header('Access-Control-Allow-Headers', 'Authorization');
  next();
});

app.use("/api/v1", router);
app.use(express.static(path.join(__dirname, "views")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("*", (req, res) => res.status(404).json({
  error: "endpoint is not registered",
}));

app.listen(port, () => {
  console.log(`server is running in port ${port}`);
});
