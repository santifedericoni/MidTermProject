/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const express = require('express');
const router  = express.Router();
const movieTrailer = require('movie-trailer');
const movieInfo = require('movie-info');
let nodemailer = require('nodemailer');
require('dotenv').config();


const getMovieTrailer = (movieName) => {
  return new Promise((resolve, reject) => {
    movieTrailer(movieName)
    .then(response => {
      resolve(response);
    })
    .catch(() => {
      resolve('Trailer was not found.');
    })
  });
};

const getMovieInfo = (movieName) => {
  return new Promise((resolve, reject) => {
    let data;
    movieInfo(movieName)
    .then(response => {
      if (response.overview) {
        console.log("IF FIRED");
        data = response.overview;
        resolve(data);
      } else {
        console.log("ELSE FIRED");
        data = 'Description not found';
        resolve(data);
      }
    })
    .catch(err => {
      reject(err);
    })
  });
};







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
      // console.log(movieChoice);
      let trailer;
      let description;
      getMovieTrailer(movieChoice)
      .then(response => {
        return response;
      })
      .then((response) => {
        trailer = response;
        return getMovieInfo(movieChoice);
      })
      .then(response => {
        console.log(typeof response);
        description = response;
        console.log(description);
        return;
      })
      .then(() => {
        let values = [req.body.poll_id, movieChoice, description, trailer];
        let query = `
          INSERT INTO choices (poll_id, title, description, trailerURLS)
          VALUES ($1, $2, $3, $4) RETURNING *;
          `;
        return db.query(query, values);
      })
      .then(data => {
        // console.log(data);
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
        // console.log(data);
        let transporter = nodemailer.createTransport({
          service: 'mailgun',
          auth: {
            user: 'postmaster@sandboxd7bc8db836ac4a8698465009cc5c7b26.mailgun.org',
            pass: `${process.env.MAILGUN_PW}`
          }
        });
        let mailOptions = {
          from: 'postmaster@sandboxd7bc8db836ac4a8698465009cc5c7b26.mailgun.org',
          to: `${data.rows[0].email}`,
          subject: 'Testmail',
          text: `Voting Link: http://localhost:8080/votepage/${data.rows[0].id}. View Results: http://localhost:8080/results/${data.rows[0].id}.`
        };
        return transporter.sendMail(mailOptions);
        })
        .then((data) => {
          // console.log('Email sent: ', data.response);
          res
            .status(200)
            .send('Poll was created and results and vote links were sent successfully');
          return;
        })
        .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
        return;
      });
    }
  });


  return router;
};




