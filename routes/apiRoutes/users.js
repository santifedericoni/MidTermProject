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
    const values = ['alan@gmail.com'];
    db.query(`
      SELECT * FROM users
      WHERE email = $1;
    `, values)
      .then(data => {
        const user = data.rows[0];
        res.json({ user });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
        db.end();
      });
  });


  return router;
};
