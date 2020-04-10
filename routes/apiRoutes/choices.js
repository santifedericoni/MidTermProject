/* eslint-disable indent */
/* eslint-disable camelcase */
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
    let pollId;
    db.query(query, values)
      .then(data => {
        pollId = data.rows[0].id;
        return pollId;
      })
      .then(response => {
        let promises = [];
        for (let movieChoice of req.body.movieChoices) {

          promises.push(movieHelpers.getMovieInfo(movieChoice));
          promises.push(movieHelpers.getMovieTrailer(movieChoice));
        }
        Promise.all(promises).then((results) => {
          let query = "INSERT INTO choices (poll_id, title, description, trailerURLS) VALUES ";
          let i = 0;
          let valuesInsert = [];
          for (let movieChoice of req.body.movieChoices) {
            let lastChar = ",";
            if (i / 2 === req.body.movieChoices.length - 1) {
              lastChar = " ";
            }
           let row = ` (${pollId}, '${movieChoice}', $${i+1}, $${i + 2})${lastChar} `;
          valuesInsert.push(results[i], results[i + 1]);
           query = query + row;
           i = i + 2;
          }

          //this is changing the last insert row from a , to a ;
          query = query + " RETURNING *;";
          db.query(query, valuesInsert)
          //here i get the info to send the email
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
            .then((data) => {
              movieHelpers.sendLinks(data.rows[0].email,data.rows[0].id);
              })
              .then((data) => {
                  console.log('Email sent1: ', pollId);
                  res
                  .send({ data: pollId });
                return;
              });
        });

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
