const logger = require(`../service/logger`);
exports.error_404 = (req, res, nex) => {
  logger.error(`Error page not found ${404}`);
  res.status(404).json({
    status: 404,
    message: "Page not found",
  });
};
