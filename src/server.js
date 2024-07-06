const express = require('express');
const morgan = require('morgan');

const allRoute = require('./routes/all.route');
const errorHandle = require('./middleware/error.middleware');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(morgan());

allRoute(app);
app.use(errorHandle);

app.listen(port, () => {
    console.log(`app running on port: ${port}`);
});
