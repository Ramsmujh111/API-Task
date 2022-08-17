const mongoose = require('mongoose');
const logger = require('./winston');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    logger.info(`Database is connected successfully.......`);
})
.catch(err =>{
    logger.error(`database is not connected`);
    logger.error(err.message);

})
module.exports = mongoose;