//imported modules
const mongoose = require('mongoose');

const models = require('./models.js');

const express = require('express'),
morgan = require('morgan');

const bodyParser = require('body-parser');

const app = express();

const movies = models.movies;
const users = models.users;
const Genre = models.Genre;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());


//MyFlixHomepage
app.get('/', (req, res) => {
  res.send('Welcome to myFlix! This is a database dediacated to sharing info on my favorite films ranging from action to comedy to documentaries!');
});

//Return All movies
app.get('/movies', (req, res) => {
    movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + err);
      });
  });

//Return All Users
  app.get("/users",function (req, res){
    users.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

//Return Single User by Username
  app.get('/users/:username', (req, res) => {
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
app.get('/movies/:Title', (req, res) => {
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
app.get('/movies/genres/:name', (req, res) => {
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
app.get('/movies/director/:Name', (req, res) => {
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
app.post('/users', (req, res) => {
  users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        users.create({
            username: req.body.username,
            password: req.body.password,
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
app.put('/users/:username', (req, res) => {
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
app.post('/users/:username/movies/:MovieID', (req, res) => {
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
app.delete('/users/:username', (req, res) => {
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
app.delete('/users/:username/movies/:MovieID', (req, res) => {
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
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});