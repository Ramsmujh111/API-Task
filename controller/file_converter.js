const csvtojson = require("csvtojson");
const { Parser } = require("json2csv");
const fs = require("fs");
const logger = require("../config/winston");
const csvfilepath = "./upload-file/user.csv";

/**
 * csv file to convert json file
 * @param {*} req 
 * @param {*} res 
 * @returns {excel} return excel data 
 */
exports.csv_to_json = async (req, res) => {
  // log the input of the hitting urls logs
  logger.info(`request of this URL method is ${req.method}`);
  try {
    csvtojson()
      .fromFile(csvfilepath)
      .then((users) => {
        // store data in the json file and folder and we also store the data in case
        fs.writeFileSync(
          "./json/users.json",
          JSON.stringify(users, null, users.length),
          (err) => {
            logger.error(`error message ${err.message}`);
            if (err) {
              return res.status(403).json({
                message: err.message,
              });
            }
          }
        );
        logger.info(`data is converted in json file`);
        res.status(200).json({
          status: true,
          data: users,
        });
      })
      .catch((err) => {
        // log error if any
        logger.error(err.message);
      });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      message: error.message,
    });
  }
};
/**
 * convert the json-to-csv file
 * @param {*} req 
 * @param {*} res 
 * @returns {object} convert csv to json and return json data
 */
exports.json_to_csv = async (req, res) => {
  logger.info(`request of this URL method is ${req.method}`);
  const users = req.body;
  if (Object.keys(users).length <= 0) {
    logger.error("user is the null value");
    return res.status(400).json({
      message:
        "please upload the file..",
    });
  }

  try {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(users);

    // save the data file in the our locally
    fs.writeFileSync("./json-cvs-file/downloaded-resource.csv", csv, (err) => {
      if (err) {
        logger.error(err.message);
        return res.status(400).json({
          message: err.message,
        });
      }
      logger.info(`file is save`);
    });
    // we can send the attachment for downloading resource:
    // res.attachment()
    // res.download(file , 'csv file name it's ')
    logger.info(`file has been converted into excel`);
    res.status(200).send(csv);
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      message: error.message,
    });
  }
};
