'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001
const cors = require('cors');

app.use(cors());

/////route for Locations, Geo///////
app.get('/location', (request, response) => {
  try {
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    // console.log(city);
    const locationData = new Location(geoData, city);
    response.send(locationData);
  }
  catch (error){
    errorHandler('So sorry, something went wrong', request,response);
  }
})



//////route for weather, darksky///////




app.get('/weather', (request, response) => {
  try {
    const darkSky = require('./data/darksky.json');
    const weather = request.query.search_query;
    const weatherData = new Weather(darkSky, weather);
    response.send(weatherData);
  }
  catch (error){
    errorHandler('So sorry, something went wrong', request,response);
  }
})

//////constructor for location/////

function Location (geoData, city) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
//   }

// [
//     {
//       "forecast": "Partly cloudy until afternoon.",
//       "time": "Mon Jan 01 2001"
//     },
//     {
//       "forecast": "Mostly cloudy in the morning.",
//       "time": "Tue Jan 02 2001"
//     },
//     ...
//   ]


////// constructor for weather ///////
// let date = New Date()

function Weather (darkSky, weather) {
  this.forecast = darkSky.daily.data[0].summary;
  this.time = darkSky.daily.data[1].time;
  console.log(darkSky.daily.data[0].time);
}

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

