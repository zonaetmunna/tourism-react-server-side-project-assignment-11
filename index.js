const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hi app");
});

// database
const uri = process.env.MONGODB_DEV_URI
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("connect successfully");
    const database = client.db("truism");
    const serviceCollection = database.collection("service");
    const orderCollection = database.collection("orderService");

    // POST api
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    // GET api
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      console.log(result);
      res.json(result);
    });
    // GET api for single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.json(result);
    });
    // POST api
    app.post("/orderService", async (req, res) => {
      const service = req.body;
      const result = await orderCollection.insertOne(service);
      console.log("post method hit");
      res.send(result);
    });
    // GET api
    app.get("/orderService", async (req, res) => {
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // DELETE API
    app.delete("/orderService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    //
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("listing the port", port);
});
