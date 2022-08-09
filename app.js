const express = require("express");
const app = express();
require("./connections/connect");
require("dotenv").config();
const authUserRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const error_404 = require("./routes/error-404");
const logger = require("./service/logger");
const fileRoutes = require("./routes/file_converter");
const paginationRoutes = require('./routes/pagination');
const swaggerjsdoc = require("swagger-jsdoc");
const swagger_ui = require("swagger-ui-express");
const port = process.env.PORT;

// body parser
app.use(express.json());
// doc -implentations

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: "3.0.0",
    info: {
      title: `Register and login Api's documentations`,
      version: "1.0.0",
      description: `An api that allow users to register and login and show the profile and
         also convert the cvs file to json and json to csv`,
      contact: {
        name: "xyz",
        url: "https://abcdefg.gmail.com",
        email: "xvz@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8081/",
      },
    ],
  },
  apis: [
    "./routes/auth*.js",
    "./routes/admin*.js",
    "./routes/file_converter*.js",
    "./routes/pagination*.js",
  ],
};
const openapiSpecification = swaggerjsdoc(options);
app.use("/api-docs", swagger_ui.serve, swagger_ui.setup(openapiSpecification));

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
