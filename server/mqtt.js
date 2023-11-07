const MQTT = require("async-mqtt");

console.log("Inside mqtt.js");


async function publishMQTT(topic, name, state) {
    const client = await MQTT.connectAsync("mqtt://127.0.0.1:1883")

    console.log("Starting");
    const heartBeatSignal = {
		name,
		state
	};

	console.log(JSON.stringify(heartBeatSignal));
	try {
		await client.publish(topic, JSON.stringify(heartBeatSignal));
		// This line doesn't run until the server responds to the publish
		await client.end();
		// This line doesn't run until the client has disconnected without error
		console.log("Done");
	} catch (e){
		// Do something about it!
		console.log(e.stack);
		process.exit();
	}
}


// async function listenOnMQTT() {
//   const client = await MQTT.connectAsync('mqtt://127.0.0.1:1883'); // Replace with your MQTT broker URL

//   await client.subscribe('#'); // Replace with the topic you want to subscribe to

//   client.on('message', (topic, message) => {
//     console.log(`Received message on topic: ${topic}`);
//     console.log(`Message: ${message.toString()}`);
//     // Process the received message as needed
//   });
// }

async function listenOnMQTT() {
  return new Promise((resolve, reject) => {
    const client = MQTT.connect('mqtt://127.0.0.1:1883'); // Replace with your MQTT broker URL

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('#'); // Replace with the topic you want to subscribe to
    });

    client.on('message', (topic, message) => {
      console.log(`Received message on topic: ${topic}`);
      console.log(`Message: ${message.toString()}`);
	  
      resolve({ topic, message: message.toString() });
    });

    client.on('error', (err) => {
      console.error('Error connecting to MQTT broker:', err);
      reject(err);
    });
  });
}

function listenMQTT(callback) {
  const client = MQTT.connect('mqtt://127.0.0.1:1883'); // Replace with your MQTT broker URL

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('#'); // Replace with the topic you want to subscribe to
  });

  client.on('message', (topic, message) => {
    // console.log(`Received message on topic: ${topic}`);
    // console.log(`Message: ${message.toString()}`);

    // Call the provided callback function with the message details
    callback({ topic, message });
  });

  client.on('error', (err) => {
    console.error('Error connecting to MQTT broker:', err);
  });
}



module.exports = {listenOnMQTT, publishMQTT, listenMQTT};