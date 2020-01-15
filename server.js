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
    const weatherSum = [];
    darkSky.daily.data.forEach(day =>{
      weatherSum.push(new Weather (day));
    });
    response.status(200).json(weatherSum);
  }
  catch (error){
    errorHandler('Oops! Sorry, something went wrong', request,response);
  }
})

//////constructor for location/////

function Location (geoData, city) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}


function Weather (day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
  this.icon = day.icon;
}

function errorHandler(error, request, response){
  response.status(500).send('Oops! Sorry, something went wrong');
}

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

