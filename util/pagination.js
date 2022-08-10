const logger = require("../service/logger");
let pagination = (data) => {
  let newData = [];
  data
    .then((result) => {
      newData = result;
    })
    .catch((err) => {
      logger.error(err.message);
    });
  return (req, res, next) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    const { sortBy, orderBy } = req.query;
    if (!page || !limit) {
      page = 1;
      limit = 3;
    }
    //   start index
    const startIndex = (page - 1) * limit;
    //   end index
    const endIndex = page * limit;
    // creating a new empty object
    const results = {};
    // now we are creating a new properity previouse page
    if (startIndex > 0) {
      results.previouse = {
        page: page - 1,
        limit,
      };
    }
    // now we are creating a propery previes next page
    // chek if any properity like result
    if (newData?.results) {
      if (endIndex <= Object.keys(newData.results).length) {
        results.next = {
          page: page + 1,
          limit,
        };
      }
      if (sortBy === "episode_id" && sortBy === "asc") {
        results.result = Object.entries(newData.results)
          .slice(startIndex, endIndex)
          .sort((a, b) => a.episode_id - b.episode_id);
      } else if (sortBy === "episode_id" && orderBy === "desc") {
        results.result = Object.entries(newData.results)
          .slice(startIndex, endIndex)
          .sort((a, b) => b.episode_id - a.episode_id);
      } else {
        results.result = Object.entries(newData.results).slice(
          startIndex,
          endIndex
        );
      }
    }
    // else data work as simple there is nexted to inherit
    else {
      if (endIndex <= Object.keys(newData).length) {
        results.next = {
          page: page + 1,
          limit,
        };
      }
      if (sortBy === "id" && sortBy === "asc") {
        results.result = Object.entries(newData.results)
          .slice(startIndex, endIndex)
          .sort((a, b) => a.id - b.id);
      } else if (sortBy === "id" && orderBy === "desc") {
        results.result = Object.entries(newData.results)
          .slice(startIndex, endIndex)
          .sort((a, b) => b.id - a.id);
      } else {
        results.result = Object.entries(newData.results).slice(
          startIndex,
          endIndex
        );
      }
    }
    // if we want to perform the sorting action ............
    // sort by id
    res.status(200).json(results);
    next();
  };
};
module.exports = {
  pagination,
};
