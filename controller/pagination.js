const logger = require("../service/logger");
const axios = require("axios");

exports.jsonPlaceHolder = (req, res, next) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!page || !limit) {
    page = 1;
    limit = 10;
  }
  //   start index
  const startIndex = (page - 1) * limit;
  //   end index
  const endIndex = page * limit;

  axios.get(`https://jsonplaceholder.typicode.com/posts`).then((responces) => {
    const data = JSON.parse(JSON.stringify(responces.data));
    const results = {};
    // now we are creating a propery previes page
    if (startIndex > 0) {
      results.previouse = {
        page: page - 1,
        limit,
      };
    }
    // now we are creating a propery previes next page
    if (endIndex <= Object.keys(data).length) {
      results.next = {
        page: page + 1,
        limit,
      };
    }
    results.result = Object.entries(data).slice(startIndex, endIndex);
    res.status(200).json(results);
  });
};

// ---------------------------------------------------------------------------

exports.swapi = async (req, res, next) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!page || !limit) {
    page = 1;
    limit = 3;
  }
  //   start index
  const startIndex = (page - 1) * limit;
  //   end index
  const endIndex = page * limit;
  axios
    .get(`https://swapi.dev/api/films`)
    .then((responces) => {
      const data = JSON.parse(JSON.stringify(responces.data));
      const results = {};
      // now we are creating a propery previes page
      if (startIndex > 0) {
        results.previouse = {
          page: page - 1,
          limit,
        };
      }
      // now we are creating a propery previes next page
      if (endIndex <= Object.keys(data.results).length) {
        results.next = {
          page: page + 1,
          limit,
        };
      }
      results.result = Object.entries(data.results).slice(startIndex, endIndex);
      res.json(results);
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(400).json({
        status: false,
        message: err.message,
      });
    });
};
