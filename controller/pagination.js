const logger = require("../service/logger");
const axios = require("axios");

exports.jsonPlaceHolder = async (req, res, next) => {
  try {
    const data = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
    return JSON.parse(JSON.stringify(data.data));
  } catch (error) {
    console.log(error.message);
  }
};

// ---------------------------------------------------------------------------

exports.swapi = async (req, res, next) => {
  try {
    const data = await axios.get(`https://swapi.dev/api/films`);
    return JSON.parse(JSON.stringify(data.data));
  } catch (error) {
    console.log(error.message);
  }
};
