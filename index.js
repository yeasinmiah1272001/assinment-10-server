const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config()
const cors = require("cors");
const app = express();
const ObjectId = require("mongodb").ObjectId; // Add this line

// Middleware
app.use(cors());
app.use(express.json());

// yeasinmiah1272001
// pfOEnU1r99eU0txF



const port = process.env.PORT || 5000;

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dwa8kzf.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const userCollection = client.db("addDB").collection("add");

    // Handle POST request for adding data

    app.post("/add", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    // Read
    app.get("/add", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
   
     // Delete
    app.delete("/my/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await userCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

     // updated
    app.get("/my/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("delete", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await userCollection.findOne(query);
      console.log(result);
      res.send(result);
    });


    app.put("/my/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log("id", id, data);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUSer = {
        $set: {
          band: data.band,
          price: data.price,
          img: data.img,
          description:data.description,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedUSer,
        options
      );
      res.send(result);
    });







    


  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().then(() => {
  // Start the Express server after successfully connecting to MongoDB
  app.listen(port, () => {
    console.log(`Simple Crud is Running on port ${port}`);
  });
}).catch(console.dir);