const axios = require('axios');
const fs = require('fs');
const path = require("path");
const User = require("../models/user");
const Movie = require("../models/movie");

const dbEmpty = async() => {
  const countUser = await User.estimatedDocumentCount();
  const countMovie = await Movie.estimatedDocumentCount();
  if(countUser === 0 && countMovie === 0){

    const pathUser = path.resolve(__dirname, '../../','data', 'user.json');
    fs.readFile(pathUser, 'utf8', async(err, data) => {
      if (err) throw console.log(err);
      insertUser(JSON.parse(data)[0]);
    });

    const pathMovies = path.resolve(__dirname, '../../','data', 'movies.json');
    fs.readFile(pathMovies, 'utf8', async(err, data) => {
      if (err) throw console.log(err);
      const datos = JSON.parse(data);
      await datos.map((json) => {
        insertMovie(json);
      });
    });
  }
}

const insertUser = async(json) => {
  await axios.post('http://localhost:8000/api/signup', json)
    .then(() => {console.log('ok');})
    .catch(() => {console.log("error");});
};

const insertMovie = async(json) => {
  await axios.post('http://localhost:8000/api/movies/create', json)
    .then(() => {console.log('ok');})
    .catch(() => {console.log("error"); });
};

module.exports = {dbEmpty};