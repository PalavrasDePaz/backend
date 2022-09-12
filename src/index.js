const express = require('express');

const app = express();


app.get('/', (request, response) => {
  return response.send('Hello Palavras de Paz!');
})

app.listen(3333);

