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
app.use(express.urlencoded({ extended: false }));

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
  let id = req.body.id;
  client.hgetall(id, function (err, obj) {
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

//add user page
app.get('/user/add', function (req, res, next) {
  res.render('adduser');
});

//process user page
app.post('/user/add', function (req, res, obj) {
  let id = req.body.id;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let phone = req.body.phone;

  client.hmset(
    id,
    [
      'firstname',
      firstname,
      'lastname',
      lastname,
      'email',
      email,
      'phone',
      phone,
    ],
    function (err, response) {
      if (err) {
        console.log(err);
      }
      console.log(response);
      res.redirect('/')
    }
  );
});

//add user page
app.delete('/user/delete/:id', function (req, res, next) {
    client.del(req.params.id); 

    res.redirect('/');
  });
  

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
