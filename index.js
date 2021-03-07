const express = require('express');
const handlerbars = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const redis = require('redis');

//set port
const port = 3000;

//init app
const app = express();
app.use(express.json());

//view engine
app.engine('handlebars', handlerbars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//method override
app.use(methodOverride('_method'));

app.get('/', function (req, res, next) {
  res.render('searchusers');
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
