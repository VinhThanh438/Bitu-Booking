const express = require('express');
const morgan = require('morgan');

const errorHandle = require('./middleware/error.middleware');
const allRoute = require('./routes/all.route');
const apiRoute = require('./routes/api');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(morgan());

app.use('/api/v1', apiRoute);
allRoute(app);
app.use(errorHandle);

app.listen(port, () => {
    console.log(`app running on port: ${port}`);
});
