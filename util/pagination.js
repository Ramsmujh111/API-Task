const logger = require("../service/logger");
let pagination = (data) => {
  let newData;
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
      // sortby episode_id desc
      if (sortBy === "episode_id" && orderBy === "desc") {
        let sortedData = newData.results.sort((a, b) => {
          return b.episode_id - a.episode_id;
        });
        // console.log(sortedData);
        results.result = Object.entries(sortedData).slice(startIndex, endIndex);
        // sort by episode_id asc
      }else if (sortBy === "episode_id" && orderBy === "asc") {
        let sortedData = newData.results.sort((a, b) => {
          return a.episode_id - b.episode_id;
        });
        // console.log(sortedData);
        results.result = Object.entries(sortedData).slice(startIndex, endIndex);
        // sort by title acs
      }else if (sortBy === "title" && orderBy === "acs") {
        let sortedData = newData.results.sort((a, b) => {
          return a.title > b.title ? 1 : b.title > a.title ? -1 : 0;
        });
        results.result = Object.entries(sortedData).slice(startIndex, endIndex);
        // sort by title desc
      } else if (sortBy === "title" && orderBy === "desc") {
        let sortedData = newData.results.sort((a, b) =>
          b.title > a.title ? 1 : a.title > b.title ? -1 : 0
        );
        results.result = Object.entries(sortedData).slice(startIndex, endIndex);
      }
      else{
        results.result = Object.entries(newData.results).slice(startIndex, endIndex);

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
      // sort by id ---------------------------------------
      if (sortBy === "id" && orderBy === "desc") {
        let sortedData = newData.sort((a, b) => {
          return b.id - a.id;
        });
        // console.log(sortedData);
        results.result = Object.entries(sortedData).slice(startIndex, endIndex);
        // sort by title
      } else if (sortBy === "title" && orderBy === "acs") {
        let sortedData = newData.sort((a, b) => {
          return a.title > b.title ? 1 : b.title > a.title ? -1 : 0;
        });
        results.result = Object.entries(sortedData).slice(startIndex, endIndex);
        // sort by title desc
      } else if (sortBy === "title" && orderBy === "desc") {
        let sortedData = newData.sort((a, b) =>
          b.title > a.title ? 1 : a.title > b.title ? -1 : 0
        );
        results.result = Object.entries(sortedData).slice(startIndex, endIndex);
      } else {
        results.result = Object.entries(newData).slice(startIndex, endIndex);
      }
    }
    res.status(200).json(results);
    next();
  };
};
module.exports = {
  pagination,
};
