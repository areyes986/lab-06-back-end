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
    let latitude = request.query.latitude;
    let longitude = request.query.longitude;
    const key = process.env.DARKSKY_API_KEY;
    const url = `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`;

    superagent.get(url)
      .then(data => {
        let darkSkyData = data.body.daily.data.map(day => {
          return new Weather(day);
        })
        console.log(darkSkyData);
        response.status(200).send(darkSkyData);
      });
  }
  catch (error) {
    errorHandler('Oops! Sorry, something went wrong', request, response);
  }
});

////////route for events/////////
// app.get('/events', (request, response) => {
//     try {

//         const key = process.env.EVENTFUL_API_KEY;
//         const url = `http://api.eventful.com/rest/events/search?...&where=$%7Blocation.latitude%7D,$%7Blocation.longitude%7D&within=5%60`
//     }
// })



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



///////constructor for events////////

// function events()


app.use('*', error);
app.use(errorHandler);

function error(request, response) {
  response.status(404).send('???');
}
function errorHandler(error, request, response) {
  response.status(500).send(error);
}

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
