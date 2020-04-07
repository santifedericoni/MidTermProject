/* eslint-disable func-call-spacing */
/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM polls`;
    console.log(query);
    db.query(query)
      .then(data => {
        const polls = data.rows;
        res.json({ polls });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    // console.log(req.body);

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
        res.send(newPoll);
      })
      .catch (err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
