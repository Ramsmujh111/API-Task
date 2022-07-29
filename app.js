const  express = require('express')
const app = express()
const mongoose = require('./connections/connect');
require('dotenv').config();
const authUserRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const error_404 = require('./routes/error-404');
const port = process.env.PORT;

// body parser 
app.use(express.json());
// user routes
app.use('/api/user',authUserRoutes);
// admin routes 
app.use('/api/admin',adminRoutes)
// error path when we enter any default endpoint
app.use(error_404);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));