/* eslint-disable camelcase */
/* eslint-disable func-call-spacing */
/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
//arreglar que cuando se crea una opcion que la pelicula no existe, la cree igual
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `
    SELECT * FROM polls
    ORDER BY id;
    `;
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

  router.post("/:poll_id", (req, res) => {
    const values = [Number(req.params.poll_id)];
    console.log(values);
    let query =`
      UPDATE polls
      SET completed = TRUE
      WHERE id = $1;
      `;
    db.query(query, values)
      .then(() => {
        res.send('Poll was updated successfully');
      })
      .catch (err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  return router;
};
