const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();

//settings
app.set("port", process.env.BACK_PORT || 3000);

// middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("src/public"));
app.use(cors());


app.get("/control-panel", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});


//routes
app.use("/api", require("./routes"));

//start server
app.listen(app.get("port"), () => {
  console.log("^_^ server en puerto", app.get("port",));
});