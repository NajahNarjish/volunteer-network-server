const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jw6hg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db("volunteerEvents").collection("events");
  const registeredEventsCollection = client.db("volunteerEvents").collection("registeredEvents");

  app.post("/addEvent", (req, res) => {
      const events = req.body;
      eventsCollection.insertMany(events)
      .then(result => {
        //   console.log(result.insertedCount);
          res.send(result.insertedCount)
      })
  })
  app.get("/events", (req, res) => {
        eventsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get("/event/:key", (req, res) => {
        eventsCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post("/addRegisteredEvent", (req, res) => {
        const registeredEvent = req.body;
        registeredEventsCollection.insertOne(registeredEvent)
        .then(result => {
            // console.log(result.insertedCount);
            res.send(result.insertedCount>0)
        })
    })

    // app.get("/showRegisteredEvents", (req, res) => {
    //     registeredEventsCollection.find({})
    //     .toArray((err, documents) => {
    //         res.send(documents);
    //     })
    // })

    app.get("/showRegisteredEvents", (req, res) => {
        registeredEventsCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.delete("/delete/:id", (req, res) => {
        registeredEventsCollection.deleteOne({_id: req.params.id})
        .then((result) =>{
            res.send(result.deletedCount > 0)
        })
    })

});


app.listen(port)