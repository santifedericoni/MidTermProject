const movieTrailer = require('movie-trailer');
const movieInfo = require('movie-info');

const nodemailer = require('nodemailer');
require('dotenv').config();

// sends creator of a poll links to the poll's results and voting page
const sendLinks = (email, id) => {
  let transporter = nodemailer.createTransport({
    service: 'mailgun',
    auth: {
      user: 'postmaster@sandboxd7bc8db836ac4a8698465009cc5c7b26.mailgun.org',
      pass: `${process.env.MAILGUN_PW}`
    }
  });
  let mailOptions = {
    from: 'postmaster@sandboxd7bc8db836ac4a8698465009cc5c7b26.mailgun.org',
    to: `${email}`,
    subject: 'Testmail',
    text: `Voting Link: http://localhost:8080/votepage/${id}. View Results: http://localhost:8080/results/${id}.`
  };
  return transporter.sendMail(mailOptions);
};

const getMovieTrailer = (movieName) => {
  return new Promise((resolve, reject) => {
    movieTrailer(movieName)
      .then(response => {
        resolve(response);
      })
      .catch(() => {
        resolve('Trailer link is not available.');
      });
  });
};

const getMovieInfo = (movieName) => {
  return new Promise((resolve, reject) => {
    let data;
    movieInfo(movieName)
      .then(response => {
        if (response.overview) {
          data = response.overview;
          resolve(data);
        } else {
          data = 'Description is not available';
          resolve(data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = {
  sendLinks,
  getMovieTrailer,
  getMovieInfo
};
