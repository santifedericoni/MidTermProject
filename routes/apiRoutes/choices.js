const express = require('express');
const router  = express.Router();
const movieHelpers = require('../helperFunctions');

module.exports = (db) => {

  router.get("/:poll_id", (req, res) => {
    const values = [req.params.poll_id];
    let query = `
    SELECT id, title, description, trailerURLS, points
    FROM choices
    WHERE poll_id = $1
    ORDER BY points DESC;
    `;
    db.query(query, values)
      .then(data => {
        const choices = data.rows;
        res.send(choices);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:poll_id", (req, res) => {
    const rankOrder = req.body.choiceRank;
    let point = rankOrder.length;
    for (let id of rankOrder) {
      const values = [Number(id), point];
      let query = `
      UPDATE choices
      SET points = (SELECT points FROM choices WHERE id = $1) + $2
      WHERE id = $1;
      `;
      point --;
      db.query(query, values)
        .then(() => {
          res.send('Update was successful');
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    }
  });

  router.post("/", (req, res) => {
    const pollTitle = req.body.pollTitle;
    const user_id = req.body.user_id;
    const values = [user_id, pollTitle];
    let query = `
    INSERT INTO polls (user_id, title, date_created, completed)
    VALUES ($1, $2, NOW(), false) RETURNING *;
    `;
    db.query(query, values)
    .then(data => {
      const newPoll = data.rows[0];
      return newPoll;
    })
    .then(response => {
      for (let movieChoice of req.body.movieChoices) {
        let trailer;
        let description;
        movieHelpers.getMovieTrailer(movieChoice)
          .then(response => response)
          .then((response) => {
            trailer = response;
            return movieHelpers.getMovieInfo(movieChoice);
          })
          .then(response => {
            description = response;
            return;
          })
          .then(() => {
            let values = [response.id, movieChoice, description, trailer];
            let query = `
              INSERT INTO choices (poll_id, title, description, trailerURLS)
              VALUES ($1, $2, $3, $4) RETURNING *;
            `;
            return db.query(query, values);
          })
          .then(data => {
            const values = [data.rows[0].poll_id];
            let query = `
              SELECT email, polls.id
              FROM users
              JOIN polls ON users.id = user_id
              WHERE polls.id = $1;
            `;
            return db.query(query, values);
          })
          .then(data => {
            if (movieChoice === req.body.movieChoices[req.body.movieChoices.length - 1]) {
              return movieHelpers.sendLinks(data);
            }
            return;
          })
          .then((data) => {
            if (data) {
              console.log('Email sent: ', data.response);
              res
                .status(200)
                .send(response);
              return;
            }
          })
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
        return;
      });
    });

  return router;
};







