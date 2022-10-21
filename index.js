const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@machinejackcluster.d0eh5fz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await  client.connect()
      const productCollection = client.db('machine-jack').collection('powerTools')
      const allProductCollection = client.db('machine-jack').collection('allTools')
      
        // get all power Tools
        app.get('/powertools', async(req,res)=>{
            const query = {};
            const cursor = productCollection.find(query);
            const powerTools = await cursor.toArray()
            res.send(powerTools);
        })

        // get single power tool
        app.get('/powertools/:id', async(req,res)=>{
            const id = req.params.id;
            const cursor = {_id: ObjectId(id)};
            const powerTool = await productCollection.findOne(cursor);
            res.send(powerTool);
        })

        // add new product
        app.post('/powertools', async(req,res)=>{
            const newTools = req.body;
            const powerTools = await productCollection.insertOne(newTools);
            res.send(powerTools);
        })

        // delete product
        app.delete('/powertools/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        // get all product
        app.get('/products', async(req,res)=>{
            const query = {};
            const cursor = allProductCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })

    }
    finally {
    }
}

run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('express is run')
})

app.listen(port, () => {
    console.log('server is running')
})
