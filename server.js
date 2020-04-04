// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
const homePage = require("./routes/homePage");
const createPoll = require("./routes/createPoll");
const results = require("./routes/results");
const votePage = require("./routes/votePage");
const oldPolls = require("./routes/oldPolls");

const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
app.use("/createPoll", createPoll());
app.use("/oldPolls", oldPolls());
app.use("/votePage", votePage());
app.use("/results", results());
app.use("/", homePage());

app.use("/api/widgets", widgetsRoutes(db));


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
