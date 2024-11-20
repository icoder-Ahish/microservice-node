const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const events = []
app.post('/events', async (req, res) => {
    const event = req.body;
    events.push(event)
    try {
        // Event bus posts call
        await axios.post('http://localhost:4000/events', event)
            .then(() => console.log("Event bus posts call successful"))
            .catch(err => console.error("Error in event bus posts call:", err.message));

        // Event bus comment call
        await axios.post('http://localhost:4001/events', event)
            .then(() => console.log("Event bus comment call successful"))
            .catch(err => console.error("Error in event bus comment call:", err.message));

        // Event bus query call
        await axios.post('http://localhost:4002/events', event)
            .then(() => console.log("Event bus query call successful"))
            .catch(err => console.error("Error in event bus query call:", err.message));

        // Event bus moderate service call
        await axios.post('http://localhost:4003/events', event)
            .then(() => console.log("Event bus moderate service call successful"))
            .catch(err => console.error("Error in event bus moderate service call:", err.message));

        // Send response back to the client
        res.status(200).send({ status: 'OK' });
    } catch (err) {
        console.error("Unexpected error in handling events:", err.message);
        res.status(500).send({ status: 'ERROR', message: err.message });
    }
});

app.get('/events',(req,res)=>{
    console.log(events)
    res.send(events)
})
app.listen(4005, () => {
    console.log("Listening on port 4005 for event bus...");
});
