const express = require('express');
const router  = express.Router();
const movieTrailer = require('movie-trailer');
const movieInfo = require('movie-info');

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
    // { poll_id: '7', movieChoices: [ 'Jurrasic Park', 'Excalibur' ] }

    movieTrailer(req.body.movieChoices[0])
      .then(response => {
        console.log(response);
      })
      .catch(console.error);

    movieInfo(req.body.movieChoices[0])


      for (movieChoice)

      .then(response => {
        console.log(response.overview);
      })
      .catch(console.error);


  });

  return router;
};
