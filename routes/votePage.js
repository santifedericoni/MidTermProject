const express = require('express');
const router  = express.Router();

module.exports = () => {
  router.get("/", (req, res) => {
    res.render("../views/vote_page");
  });
  return router;
};



