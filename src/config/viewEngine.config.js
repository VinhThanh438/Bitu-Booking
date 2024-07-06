const express = require('express');
const { engine } = require('express-handlebars');
const handlebars = require('handlebars');
const helpers = require('handlebars-helpers');

const configViewEngine = (app) => {
    helpers.comparison({ handlebars: handlebars });
    app.use(express.static('src/public'));
    app.engine('.hbs', engine({ extname: '.hbs' }));
    app.set('view engine', '.hbs');
    app.set('views', './src/views');
};

module.exports = configViewEngine;
