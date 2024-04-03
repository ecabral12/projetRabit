// routes/users.js
const express = require('express');
const router = express.Router();
const amqp = require('amqplib/callback_api');

// RabbitMQ connection details
const rabbitUrl = 'amqp://localhost';
const exchange = 'my_exchange';
const queue = 'my_queue';

 // Function to send a message
function sendMessage(message) {
    if (message === undefined) {
      console.error("Le message est undefined. Veuillez fournir un message valide.");
      return;
    }
  
    amqp.connect(rabbitUrl, function(error0, connection) {
      if (error0) {
        throw error0;
      }
  
      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
  
        channel.assertExchange(exchange, 'fanout', { durable: false });
        channel.publish(exchange, '', Buffer.from(message));
      });
    });
  }
  

// Function to consume messages
function consumeMessages(callback) {
  amqp.connect(rabbitUrl, function(error0, connection) {
    if (error0) {
      throw error0;
    }

    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertExchange(exchange, 'fanout', { durable: false });
      channel.assertQueue(queue, { durable: false });

      channel.bindQueue(queue, exchange, '');

      channel.consume(queue, function(msg) {
        callback(msg.content.toString());
      }, { noAck: true });
    });
  });
}

module.exports = { sendMessage, consumeMessages };

router.post('/send-message', (req, res) => {
    const { message } = req.body;
    sendMessage(message);
    res.json({ "message sent :": message });
  });

router.get('/consume-messages', (req, res) => {
    consumeMessages((message) => {
      res.json({ message });
    });
});

// export the router module so that server.js file can use it
module.exports = router;
