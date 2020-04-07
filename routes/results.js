const express = require('express');
const router  = express.Router();

module.exports = () => {
  router.get("/:poll_id", (req, res) => {
    const templateVars = req.params.poll_id;
    res.render(`../views/results`, { templateVars });
  });
  return router;
};



