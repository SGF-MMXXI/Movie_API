const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to myFlix! This is a database dediacated to sharing info on my favorite films ranging from action to comedy to documentaries!');
});

let topMovies = [
  {
    title: 'Spider-Man:Far From Home',
    released: '2019'
    
  },
  {
    title: 'Beautiful Noise',
    released: '2014'
  },
 
  {
    title: 'The Decline of Western Civilization',
    released: '1981'
  },

  {
    title: 'Clerks',
    released: '1994'
  },

  {
    title: 'Private Parts',
    released: '1997'
  },

  {
    title: 'Zootopia',
    released: '2016'
  },
  {
    title: ' The Wrestler',
    released: '2008'
  },
 
  {
    title: 'Dogtown and Z-Boys',
    released: '2001'
  },

  {
    title: 'Deadpool',
    released: '2016'
  },

  {
    title: 'Beyond The Mat',
    released: '1999'
  }
];

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/documentation.html', (req, res) => {
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});