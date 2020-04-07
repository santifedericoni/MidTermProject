const express = require('express');
const router  = express.Router();

module.exports = () => {
  router.get("/:poll_id", (req, res) => {
    const templateVars = req.params.poll_id;
    res.render("../views/vote_page", { templateVars });
  });
  return router;
};

//http://localhost:8080/scripts/AJAXvotePage.js

//http://localhost:8080/votePage/scripts/AJAXvotePage.js
