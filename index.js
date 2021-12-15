//imported modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
bodyParser = require('body-parser');
const models = require('./models.js');


app = express();

const { check, validationResult } = require('express-validator');

const movies = models.movies;
const users = models.users;
const Genre = models.Genre;

//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth.js')(app);

const passport = require('passport');
require('./passport');
app.use(passport.initialize());

//MyFlixHomepage
app.get('/', (req, res) => {
  res.send('Welcome to myFlix! This is a database dediacated to sharing info on my favorite films ranging from action to comedy to documentaries!');
});

//Return All movies
app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
    movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//Return All Users
  app.get("/users",passport.authenticate("jwt", { session: false }), (req, res) => {
    users.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

//Return Single User by Username
  app.get('/users/:username',  passport.authenticate('jwt', { session: false}), (req, res) => {
    users.findOne({username: req.params.username})
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

app.get('/documentation.html', (req, res) => {
});

//Get single movie by title
app.get('/movies/:Title',  passport.authenticate('jwt', { session: false}), (req, res) => {
    movies.findOne({Title: req.params.Title})
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {//error callback
            console.error(err);
            res.status(500).send('Error: ' + err);
    });
});

//Return movies by Genre
app.get('/movies/genres/:name',  passport.authenticate('jwt', { session: false}), (req, res) => {
    movies.find({ "Genre.Name" : req.params.name })
        .then((genre) => {
            res.json(genre);
        })
        .catch ((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//Return Director Data
app.get('/movies/director/:Name',  passport.authenticate('jwt', { session: false}), (req, res) => {
  movies.findOne({ "Director.Name" : req.params.Name })
    .then((movies) => {
      res.json(movies.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Add User
app.post('/users',
// validation logic
[
  check('username', 'username is required').isLength({ min: 5 }),
  check(
    'username',
    'username contains non alphnumeric characters - not allowed.'
  ).isAlphanumeric(),
  check('password', 'password is required').not().isEmpty().isLength({ min: 5 }),
  check('email', 'email does not appear to be valid').isEmail(),
],
(req, res) => {
  const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({errors: validationErrors.array()});
    }
  let hashedpassword = users.hashPassword(req.body.password);
  users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        users.create({
            username: req.body.username,
            password: hashedpassword,
            email: req.body.email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) 
          })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Update User Data
app.put('/users/:username',  passport.authenticate('jwt', { session: false}), 
// validation logic
[
  check('username', 'username is required').isLength({ min: 5 }),
  check(
    'username',
    'username contains non alphnumeric characters - not allowed.'
  ).isAlphanumeric(),
  check('password', 'password is required').not().isEmpty(),
  check('email', 'email does not appear to be valid').isEmail(),
],
(req, res) => {
  const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({errors: validationErrors.array()});
    }
  users.findOneAndUpdate(
    {username: req.params.username},
    {$set: { 
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    Birthday: req.body.Birthday,
    }
},
{new: true },
(err, updatedUser) => {
  if (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  } else {
    res.json(updatedUser);
  }
  });
});
  
  //Add Favorite Movie To User Profile
app.post('/users/:username/movies/:MovieID',  passport.authenticate('jwt', { session: false}), (req, res) => {
    users.findOneAndUpdate({ username: req.params.username},
        {$addToSet: { FavoriteMovies: req.params.MovieID}
    },
    { new: true},
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//Delete User
app.delete('/users/:username',  passport.authenticate('jwt', { session: false}), (req, res) => {
  users.findOneAndRemove({ 
    username:req.params.username 
  })
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.username + " was not found");

    } else {
      res.status(200).send(req.params.username + " was deleted.");
    
    }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error" + err);
    });
});

//Delete User Favorite Movie
app.delete('/users/:username/movies/:MovieID',  passport.authenticate('jwt', { session: false}), (req, res) => {
    users.findOneAndUpdate({ username: req.params.username},
        {$pull: { FavoriteMovies: req.params.MovieID}
    },
    { new: true},
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error has been found!');
  next();
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});



