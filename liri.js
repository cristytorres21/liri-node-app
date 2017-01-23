var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var keys = require('./keys.js');

//Twitter call to pull last 20 tweets
var Twitter = function() {

    var client = new twitter(keys.twitterKeys);

    // screename entered to pull tweets from my Twitter account
    var params = { screen_name: 'simplegirl21' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {

            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log('');
                console.log(tweets[i].text);
            }
        }
    });
}

//Spotify call to find top 20 results for song entered
var Spotify = function(songName) {

    //if no song is entered, default to "the sign by ace of base"
    if (songName === undefined) {
        songName = 'The Sign - Ace of Base';

    }
    //calls song entered
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songs = data.tracks.items;
        //console logs artist, song name, preview link, and album. also creates space between each item
        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log('artist(s): ' + songs[i].artists.map(Artist));
            console.log('song name: ' + songs[i].name);
            console.log('preview song: ' + songs[i].preview_url);
            console.log('album: ' + songs[i].album.name);
            console.log('');
        }
    });
}

//return artist name for Spotify function
var Artist = function(artist) {
    return artist.name;
}

//calls OMDB api to pull info for movie title entered
var Omdb = function(movieName) {
    //if no movie name is entered, default to 'mr nobody'
    if (movieName === undefined) {
        movieName = 'Mr Nobody';
    }
    //api call
    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

    request(urlHit, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);
            //console logs title, year, rating, imdb rating, country, languages, plot, actors, rotten tomatos rating and url when avaliable
            console.log('Title: ' + jsonData.Title);
            console.log('Year: ' + jsonData.Year);
            console.log('IMDB Rating: ' + jsonData.imdbRating);
            console.log('Country: ' + jsonData.Country);
            console.log('Language: ' + jsonData.Language);
            console.log('Plot: ' + jsonData.Plot);
            console.log('Actors: ' + jsonData.Actors);
            console.log('Rotten Tomatoes Rating: ' + jsonData.tomatoRating);
            console.log('Rotton Tomatoes URL: ' + jsonData.tomatoURL);
        }
    });

}

//calls text inside text file
var Random = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);

        var dataArr = data.split(',')

        if (dataArr.length == 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            pick(dataArr[0]);
        }

    });
}

//switch/case to run node app based command entered
var pick = function(caseData, functionData) {
    switch (caseData) {
        case 'my-tweets':
            Twitter();
            break;
        case 'spotify-this-song':
            Spotify(functionData);
            break;
        case 'movie-this':
            Omdb(functionData);
            break;
        case 'do-what-it-says':
            Random();
            break;
        default:
            console.log("Command not found!");
    }
}

//runs argv 1 and 2
var Run = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

Run(process.argv[2], process.argv[3]);