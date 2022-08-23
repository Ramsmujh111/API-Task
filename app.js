const express = require("express");
const app = express();
require("./config/mongodb_connect");
require("dotenv").config();
const authUserRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const error_404 = require("./routes/error-404");
const logger = require("./config/winston");
const fileRoutes = require("./routes/file_converter");
const paginationRoutes = require('./routes/pagination');
const YAML = require('yamljs');
const swaggerjsdoc = YAML.load('./Openapi.yaml');
const swagger_ui = require("swagger-ui-express");
const port = process.env.PORT;

// body parser

app.use(express.json());
// doc -implantation's
app.use("/api/docs", swagger_ui.serve, swagger_ui.setup(swaggerjsdoc));
// user routes
app.use("/api/user", authUserRoutes);
// admin routes
app.use("/api/admin", adminRoutes);
// file convert routes is here --------------
app.use("/api", fileRoutes);
// pagination routes
app.use('/api',paginationRoutes);
// error path when we enter any default endpoint
app.use(error_404);

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}!`);
});
