/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const express = require('express');
const router  = express.Router();
const movieTrailer = require('movie-trailer');
const movieInfo = require('movie-info');
let nodemailer = require('nodemailer');

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
        console.log(choices);
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
        .then(data => {
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

    let transporter = nodemailer.createTransport({
      service: 'mailgun',
      auth: {
        user: 'postmaster@sandboxd7bc8db836ac4a8698465009cc5c7b26.mailgun.org',
        pass: ''
      }
    });
    let mailOptions = {
      from: 'postmaster@sandboxd7bc8db836ac4a8698465009cc5c7b26.mailgun.org',
      to: 'santiago.federiconi@gmail.com',
      subject: 'Testmail',
      text: 'Hi, mail sent.54'
    };
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
      res.status(200);
      res.send('Mail Send it successful');
      return;
    });
  });
  return router;
};





// SELECT *
// FROM
//     users t1
// INNER JOIN polls t2
//     ON t1.id = t2.user_id;
// (SELECT * FROM polls WHERE id = 5)
