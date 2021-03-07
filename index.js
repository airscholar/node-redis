const express = require('express');
const handlerbars = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const redis = require('redis');

//create redis client
let client = redis.createClient();
client.on('connect', () => {
  console.log('Connected to redis...');
});

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

//search page
app.get('/', function (req, res, next) {
  res.render('searchusers');
});

//search processing
app.post('/user/search', (req, res, next) => {
  let { id } = req.body;

  client.hgetall(id, (err, obj) => {
    if (!obj) {
      res.render('searchusers', {
        error: 'User does not exist',
      });
    } else {
      obj.id = id;
      res.render('details', {
        user: obj,
      });
    }
  });
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
