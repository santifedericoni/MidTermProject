const express = require('express');
const router  = express.Router();
const movieTrailer = require('movie-trailer');

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM choices`;
    console.log(query);
    db.query(query)
      .then(data => {
        const choices = data.rows;
        res.json({ choices });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  router.post("/", (req, res) => {
    console.log(req.body);
  });

  return router;
};
