const logger = require('../config/winston');
exports.error_404 = (_req, res) => {
  logger.error(`Error page not found ${404}`);
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
};
