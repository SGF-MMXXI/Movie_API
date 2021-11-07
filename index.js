//imported modules
const express = require('express'),
morgan = require('morgan');


const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to myFlix! This is a database dediacated to sharing info on my favorite films ranging from action to comedy to documentaries!');
});

let topMovies = [
  {
    title: 'Spider-Man:Far From Home',
    genre:'Action/Adventure' ,
    released: { year: '2019' } ,
    
  },
  {
    title: 'Beautiful Noise',
    genre:'Documentary' ,
    released: { year:'2014' } ,
  },
 
  {
    title: 'The Decline of Western Civilization',
    genre:'Documentary' ,
    released: { year: '1981' } ,
  },

  {
    title: 'Clerks',
    genre:'Comedy' ,
    released: { year: '1994' } ,
  },

  {
    title: 'Private Parts',
    genre:'Comedy' ,
    released: { year:'1997' } ,
  },

  {
    title: 'Zootopia',
    genre:'Animated' ,
    released: { year:'2016' } ,
  },
  {
    title: ' The Wrestler',
    genre:'Drama' ,
    released: { year: '2008'} ,
  },
 
  {
    title: 'Dogtown and Z-Boys',
    genre:'Drama' ,
    released: { year:'2001' } ,
  },

  {
    title: 'Deadpool',
    genre:'Action/Adventure' ,
    released: { year: '2016' } ,
  },

  {
    title: 'Beyond The Mat',
    genre:'Documentary' ,
    released: { year:'1999' } ,
  }
];

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/documentation.html', (req, res) => {
});

app.get('/movies/:title/genre', (req, res) => {
  res.send('Successful GET request returning data about a genre.');
});

app.get('/movies/released/:year', (req, res) => {
  res.send('Successful GET request returning data about a release date.');
});

app.post('/newUser', (req, res) => {
  res.send('Successful POST request - new user is registered');
});

app.put('/newUser/:id/info', (req, res) => {
  res.send('Successful PUT request - user info is updated');
});

app.post('/newUser/:id/favorites', (req, res) => {
  res.send('Successful POST request - user added a movie to their favorites');
});

app.delete('/newUser', (req, res) => {
  res.send('Successful DELETE request - user has deregistered');
});

app.delete('/newUser/:id/favorites', (req, res) => {
  res.send(
    'Successful DELETE request movie has been deleted from users list of favorites.'
  );
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});