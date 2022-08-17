const logger = require("../config/winston");
const axios = require("axios");
const {
  getPaginatedResult,
  getsortingResult,
} = require("../util/paginationResult");

/**
 * fetch data from the jsonplaceholder and return the response
 * @param {*} req 
 * @param {*} res 
 * @returns {object} return fetch data
 */
exports.jsonPlaceHolder = async (req, res) => {
  try {
    const data = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
    const parseData = JSON.parse(JSON.stringify(data.data));
    // if sort by and orderby is true
    if (req.query.sortBy && req.query.orderBy) {
      const sortedData = getsortingResult(
        parseData,
        req.query.sortBy,
        req.query.orderBy
      );
      const paginated_data = getPaginatedResult(
        sortedData,
        parseInt(req.query.page),
        parseInt(req.query.limit)
      );
     return res.status(200).json(paginated_data);
    }
// if no sortby and order by asc/desc parameter
    const getpaginated_data = getPaginatedResult(
      parseData,
      parseInt(req.query.page),
      parseInt(req.query.limit)
    );
    res.status(200).json(getpaginated_data);
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      status:false,
      message:error.message
    })
  }
};
/**
 * fetch data from the jsonplaceholder and return the response
 * @param {*} req 
 * @param {*} res 
 * @returns {object} return fetch data
 */
exports.swapi = async (req, res) => {
  try {
    const data = await axios.get(`https://swapi.dev/api/films`);
    const parseData = JSON.parse(JSON.stringify(data.data.results))
     // if sort by and orderby is true
    if (req.query.sortBy && req.query.orderBy) {
      const sortedData = getsortingResult(
        parseData,
        req.query.sortBy,
        req.query.orderBy
      );
      const paginated_data = getPaginatedResult(
        sortedData,
        parseInt(req.query.page),
        parseInt(req.query.limit)
      );
     return res.status(200).json(paginated_data);
    }
// if no sortby and order by query parameter
    const paginated_Data = getPaginatedResult(
      parseData,
      parseInt(req.query.page),
      parseInt(req.query.limit)
    );
    res.status(200).json(paginated_Data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status:false,
      message:error.message
    });
  }
};
