const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const errorHandle = require('./middleware/error.middleware');
const configViewEngine = require('./config/viewEngine.config');
const allRoute = require('./routes/all.route');
const apiRoute = require('./routes/api');
const clientRoute = require('./routes/clientRoute');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(morgan());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
configViewEngine(app);

app.use('/', clientRoute);
app.use('/api/v1', apiRoute);
allRoute(app);
app.use(errorHandle);

app.listen(port, () => {
    console.log(`app running on port: ${port}`);
});
