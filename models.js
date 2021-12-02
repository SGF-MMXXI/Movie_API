const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
        Name: String,
        Description: String
    },
    Director: {
      Name: String,
      Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  Birthday: Date,
FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }]
});



let movies = mongoose.model('movies', movieSchema);
let users = mongoose.model('users', userSchema);



module.exports.movies = movies;
module.exports.users = users;

