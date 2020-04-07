const express = require('express');
const router  = express.Router();

module.exports = () => {
  router.get("/:poll_id", (req, res) => {
    res.render(`../views/results`);
  });
  return router;
};



