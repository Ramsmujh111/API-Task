const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log('Database is connected successfully.......');
})
.catch(err =>{
    console.log('databse is not connected');
    console.log(err.message)

})
module.exports = mongoose;