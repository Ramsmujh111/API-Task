const  express = require('express')
const app = express()
require('./connections/connect');
require('dotenv').config();
const authUserRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const error_404 = require('./routes/error-404');
const logger = require('./service/logger');
const fileRoutes = require('./routes/file_converter');
const port = process.env.PORT;

// body parser 
app.use(express.json());
// user routes
app.use('/api/user',authUserRoutes);
// admin routes 
app.use('/api/admin',adminRoutes)

// file convert routes is here --------------
app.use('/api',fileRoutes);
// error path when we enter any default endpoint
app.use(error_404);

app.listen(port, () =>{
    logger.info(`Example app listening on port ${port}!`);
});