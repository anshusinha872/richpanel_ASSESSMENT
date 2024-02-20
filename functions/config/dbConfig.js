const { MongoClient } = require("mongodb");

const uri = "mongodb://admin:Anshu.%401237Ss@139.59.24.125:27017/";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("richpanel");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
}

module.exports = { connect };
