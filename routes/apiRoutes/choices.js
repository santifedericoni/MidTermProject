const express = require('express');
const router  = express.Router();
const movieTrailer = require('movie-trailer');
const movieInfo = require('movie-info');
const Mailgun = require('mailgun').Mailgun;



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
    for (let movieChoice of req.body.movieChoices) {

      let trailer;
      let description;

      movieTrailer(movieChoice)
        .then(response => {
          trailer = response;
          return;
        })
        .then(response => {
          movieInfo(movieChoice)
            .then(response => {
              description = response.overview;
              return;
            })
            .then(response => {
              let values = [req.body.poll_id, movieChoice, description, trailer];
              let query = `
            INSERT INTO choices (poll_id, title, description, trailerURLS)
            VALUES ($1, $2, $3, $4) RETURNING *;
            `;
              db.query(query, values)
                .then(data => {
                  return;
                })
                .catch(err => {
                  res
                    .status(500)
                    .json({ error: err.message });
                  return;
                });
            });
        });
    }
    let mg = new Mailgun('');
    mg.sendText('cebalovos@cebalovos.com', 'santiago.federiconi@gmail.com', 'your polls was created', 'link to your poll');
    res.send('Choices have been created');
  });
  return router;
};
