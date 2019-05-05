// Read and set environment variables
require('dotenv').config();

// Setting the Variables and packages
var request = require('request');
var fs = require('fs');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
//Capturing the user input from the command line
var userRequest = process.argv[2];
var userInput = process.argv[3];

//FUNCTIONS
function UserInputs(userRequest, userInput) {
  switch (userRequest) {
    case 'movie-this':
      movieInfo(userInput);
      break;
    case 'spotify-this-song':
      songInfo(userInput);
      break;
    case 'concert-this':
      concertInfo(userInput);
      break;
    case 'do-what-it-says':
      whatItSaysInfo();
      break;
    default:
      console.log(
        'Invalid Option. Please type any of the following options: \nmovie-this  \nspotify-this-song \nconcert-this   \ndo-what-it-says'
      );
  }
}

// Calling the function
UserInputs(userRequest, userInput);

// Bands in Town
function concertInfo(userInput) {
  var queryUrl =
    'https://rest.bandsintown.com/artists/' +
    userInput +
    '/events?app_id=codingbootcamp';
  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      var concerts = JSON.parse(body);
      // Displaying  concerts
      for (var i = 0; i < concerts.length; i++) {
        // Displaying the Bands in Town info and Append in log.txt
        console.log('---------- EVENT INFORMATION ----------');
        fs.appendFileSync(
          'log.txt',
          '---------- EVENT INFORMATION ----------\n'
        );
        console.log(i);
        fs.appendFileSync('log.txt', i + '\n');
        console.log('Name of the Venue: ' + concerts[i].venue.name);
        fs.appendFileSync(
          'log.txt',
          'Name of the Venue: ' + concerts[i].venue.name + '\n'
        );
        console.log('Date of the Event: ' + concerts[i].datetime);
        fs.appendFileSync(
          'log.txt',
          'Date of the Event: ' + concerts[i].datetime + '\n'
        );
        console.log('Venue Location: ' + concerts[i].venue.city);
        fs.appendFileSync(
          'log.txt',
          'Venue Location: ' + concerts[i].venue.city + '\n'
        );

        console.log('------------------------------');
        fs.appendFileSync('log.txt', '------------------------------' + '\n');
      }
    } else {
      console.log('Error occurred.');
    }
  });
}

// Spotify
function songInfo(userInput) {
  if (userInput === undefined) {
    //default Song "The Sign by Ace of Base"
    userInput = 'The Sign';
  }
  spotify.search(
    {
      type: 'track',
      query: userInput
    },

    // Error function
    function(err, data) {
      if (err) {
        console.log('Error occurred: ' + err);
        return;
      }
      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log('---------- SONG INFORMATION ----------');
        fs.appendFileSync(
          'log.txt',
          '---------- SONG INFORMATION ----------\n'
        );
        console.log(i);
        fs.appendFileSync('log.txt', i + '\n');
        console.log('Song name: ' + songs[i].name);
        fs.appendFileSync('log.txt', 'song name: ' + songs[i].name + '\n');
        console.log('Artist(s): ' + songs[i].artists[0].name);
        fs.appendFileSync(
          'log.txt',
          'artist(s): ' + songs[i].artists[0].name + '\n'
        );
        console.log('Album: ' + songs[i].album.name);
        fs.appendFileSync('log.txt', 'album: ' + songs[i].album.name + '\n');
        console.log('Preview song: ' + songs[i].preview_url);
        fs.appendFileSync(
          'log.txt',
          'preview song: ' + songs[i].preview_url + '\n'
        );

        console.log('--------------------------------------');
        fs.appendFileSync(
          'log.txt',
          '--------------------------------------\n'
        );
      }
    }
  );
}

// Getting movie information OMDB
function movieInfo(userInput) {
  if (userInput === undefined) {
    userInput = 'Mr. Nobody';
    console.log('-----------------------');
    fs.appendFileSync('log.txt', '-----------------------\n');
    console.log(
      "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/"
    );
    fs.appendFileSync(
      'log.txt',
      "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +
        '\n'
    );
    console.log("It's on Netflix!");
    fs.appendFileSync('log.txt', "It's on Netflix!\n");
  }
  var queryUrl =
    'http://www.omdbapi.com/?t=' + userInput + '&y=&plot=short&apikey=8e8515ae';
  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      var movies = JSON.parse(body);
      console.log('---------- MOVIE INFORMATION ----------');
      fs.appendFileSync('log.txt', '---------- MOVIE INFORMATION ----------\n');
      console.log('Title: ' + movies.Title);
      fs.appendFileSync('log.txt', 'Title: ' + movies.Title + '\n');
      console.log('Release Year: ' + movies.Year);
      fs.appendFileSync('log.txt', 'Release Year: ' + movies.Year + '\n');

      console.log('Country of Production: ' + movies.Country);
      fs.appendFileSync(
        'log.txt',
        'Country of Production: ' + movies.Country + '\n'
      );
      console.log('Language: ' + movies.Language);
      fs.appendFileSync('log.txt', 'Language: ' + movies.Language + '\n');
      console.log('Actors: ' + movies.Actors);
      fs.appendFileSync('log.txt', 'Actors: ' + movies.Actors + '\n');

      console.log('IMDB Rating: ' + movies.imdbRating);
      fs.appendFileSync('log.txt', 'IMDB Rating: ' + movies.imdbRating + '\n');
      console.log(
        'Rotten Tomatoes Rating: ' + getRottenTomatoesRatingValue(movies)
      );
      fs.appendFileSync(
        'log.txt',
        'Rotten Tomatoes Rating: ' + getRottenTomatoesRatingValue(movies) + '\n'
      );
      console.log('Plot: ' + movies.Plot);
      fs.appendFileSync('log.txt', 'Plot: ' + movies.Plot + '\n');
      console.log('---------------------------------------');
      fs.appendFileSync('log.txt', '---------------------------------------\n');
    } else {
      console.log('Error occurred.');
    }
  });
}

// gETTING Rotten Tomatoes Rating
function getRottenTomatoesRatingObject(data) {
  return data.Ratings.find(function(item) {
    return item.Source === 'Rotten Tomatoes';
  });
}

function getRottenTomatoesRatingValue(data) {
  return getRottenTomatoesRatingObject(data).Value;
}

// random.txt file
function whatItSaysInfo() {
  fs.readFile('random.txt', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    var dataArr = data.split(',');
    UserInputs(dataArr[0], dataArr[1]);
  });
}
