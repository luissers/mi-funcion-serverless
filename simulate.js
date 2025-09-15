// simulate.js
const handler = require('./handler').handler;

// Objeto de evento que simula una petición POST
const event = {
  httpMethod: 'POST',
  body: JSON.stringify({ "name": "Carlos", "email": "carlos@mail.com" })
};

// Invocar la función handler con el evento
handler(event)
  .then(result => {
    console.log("Response from serverless function:");
    // Para ver el resultado bonito, parseamos el body
    const body = JSON.parse(result.body);
    console.log({ ...result, body });
  })
  .catch(error => {
    console.error("Error during simulation:", error);
  });