'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001
const cors = require('cors');
const superagent = require('superagent');

app.use(cors());

/////route for Locations, Geo///////
app.get('/location', (request, response) => {
  try {
    const city = request.query.city;
    const key = process.env.LOCATIONIQ_API_KEY;
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    superagent.get(url)
      .then(data => {
        const geoData = data.body[0];
        const locationData = new Location(geoData, city)
        response.status(200).send(locationData);
      })
  }
  catch (error) {
    errorHandler('So sorry, something went wrong', request, response);
  }
});


//////route for weather, darksky///////
app.get('/weather', (request, response) => {
  try {
    const darkSky = require('./data/darksky.json');
    let darkSkyData = darkSky.daily.data;
    const data = darkSkyData.map(day => {
      return new Weather(day);
    })
    // console.log(data);
    response.status(200).send(data);
  }
  catch (error) {
    errorHandler('Oops! Sorry, something went wrong', request, response);
  }
})

//////constructor for location/////

function Location(geoData, city) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

//////constructor for weather//////

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}


app.use('*', error);
app.use(errorHandler);

function error(request, response) {
  response.status(404).send('???');
}
function errorHandler(error, request, response) {
  response.status(500).send(error);
}

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
