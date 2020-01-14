'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001
const cors = require('cors');

app.use(cors());

app.get('/hello', (request, response) => {
  response.send('hello, wassup');
})




app.listen(PORT, () => console.log(`listening on port ${PORT}`));

