'use strict';

const express = require('express'); // express is a server
const app = express(); //
require('dotenv').config(); // goes into env file and gets the variables
const PORT = process.env.PORT || 3001
const cors = require('cors'); // allows server to talk to front-end
const superagent = require('superagent'); // pulls data from APIs
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL); //server becomes the client, connects to postgres database
client.on('error', err => console.error(err)) ///tells you if you are up and running
app.use(cors());

////// route sql /////////


let locationData = {};
// let weatherData = 

/////route for Locations, Geo///////
app.get('/location', (request, response) => { // route called location, gave a call back
  try {
    const city = request.query.city; // resquest is what is sent from front end, query lives in the url,
    const key = process.env.LOCATIONIQ_API_KEY;
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

    superagent.get(url)
      .then(data => {
        const geoData = data.body[0];
        locationData = new Location(geoData, city)

        let sql = 'INSERT INTO locations (city,display_name,latitude,longitude) VALUES ($1, $2, $3, $4);';
        let safeValues = [locationData.search_query, locationData.formatted_query, locationData.latitude, locationData.longitude];
        client.query(sql, safeValues);

        response.status(200).send(locationData);
      });
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
        response.status(200).send(darkSkyData);
      });
  }
  catch (error) {
    errorHandler('Oops! Sorry, something went wrong', request, response);
  }
});

////////route for events/////////
app.get('/events', (request, response) => {
  try {
    const key = process.env.EVENTFUL_API_KEY;
    const url = `http://api.eventful.com/json/events/search?keywords=music&location=${locationData.search_query}&app_key=${key}`;
    console.log(url);

    superagent.get(url)
      .then(data => {
        let eventData = JSON.parse(data.text);
        let localEvents = eventData.events.event.map(mapEvent => {
          return new MoreEvents(mapEvent);
        });
        response.status(200).send(localEvents);
      });
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

///////constructor for events////////

function MoreEvents(mapEvent) {
  this.link = mapEvent.url;
  this.name = mapEvent.title;
  this.summary = mapEvent.description;
  this.event_date = mapEvent.start_time.slice(0, 10);
}



app.use('*', error);
app.use(errorHandler);

function error(request, response) {
  response.status(404).send('???');
}
function errorHandler(error, request, response) {
  response.status(500).send(error);
}

client.connect() //tells us if we are connected or not/ tells us if we are connected or not
  .then(app.listen(PORT, () => console.log(`listening on port ${PORT}`))
  ) // add app.listen in
  .catch((err) => console.error(err));

// app.listen(PORT, () => console.log(`listening on port ${PORT}`));

