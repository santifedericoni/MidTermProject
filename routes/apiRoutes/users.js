/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    const values = [req.query.email];
    console.log(values);
    db.query(`
      SELECT * FROM users
      WHERE email = $1;
    `, values)
    .then(data => {
      if (data.rows.length !== 0) {
        return data;
      } else {
        return db.query(`
        INSERT INTO users (email)
        VALUES ($1) RETURNING *;
        `, values)
      }
    })
    .then(data => {
      const user = data.rows[0];
      res.send(user);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  return router;
};
