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
    console.log(city);
    const locationData = new Location(geoData, city);
    response.send(locationData);
  }
  catch (error){
    errorHandler('So sorry, something went wrong', request,response);
  }
})

function Location (geoData, city){
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}


app.listen(PORT, () => console.log(`listening on port ${PORT}`));

