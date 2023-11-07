const express = require('express');
const cors = require('cors');
const {listenOnMQTT, listenMQTT} = require('./mqtt.js');

const app = express();
app.use(cors());
app.listen(5500);

app.get('/app', (req, res) => {
    // shared_obj.then(data => {
    //     console.log("sending", data);
    //     res.send(data);
    // })
    console.log("sending.......", shared_obj, typeof(shared_obj));
    res.send(shared_obj);
    shared_obj = {};
});

// let shared_obj 
// publishMQTT('heartBeat', 'DATA_FLY_LOCAL', 'active');
// let shared_obj = listenOnMQTT().then(({topic, message}) => {
//     console.log("something heared", topic, message);
//     console.log(message, typeof message);
//     return message;
// }).catch(err => {
//     console.log(err);
// });
let shared_obj = {};

function handleMQTTMessage({ topic, message }) {
  console.log("Something heard:", topic);
  if(topic == '/heartbeat')
  {
    console.log(JSON.parse(message.toString()), typeof JSON.parse(message.toString()));

    // Perform additional actions or logic with the received message here
    shared_obj = message.toString();
  }

}

listenMQTT(handleMQTTMessage);

// Access the shared object later
console.log(shared_obj);