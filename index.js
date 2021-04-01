const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express()
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-Parser');
require('dotenv').config()


const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



console.log(process.env.DB_USER)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  })




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvjuc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
 console.log('connection error',err)
    const cartCollection = client.db("shopdb").collection("cart");
    const ordersCollection = client.db("shopdb").collection("orders");

    app.get ('/product/:id',(req,res)=>{
        console.log(req.params.id);
        cartCollection.find({_id: ObjectId (req.params.id)})
    
        .toArray((err,items)=>{
          res.send(items[0])
          console.log(items);
          console.log(err) 
        })

    })
   
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('adding new product:', newProduct);
        cartCollection.insertOne(newProduct)
        .then(result => {
           console.log('inserted count', result.insertedCount)
           res.send(result.insertedCount > 0)
        })
    })

    app.post('/addOrders',(req, res) =>{
        const newProduct =req.body;
        console.log('added new product', newProduct)
        ordersCollection.insertOne(newProduct)
        .then(result =>{
          console.log('insertedCount',result.insertedCount);
          res.send(result.insertedCount > 0)
        })
    })

   
    app.get('/products', (req, res) => {
        cartCollection.find()
        .toArray((err, items) => {
            res.send(items);
    
        })
      })

      app.get('/productManage',(req,res)=>{
        cartCollection.find()
        .toArray((err,items) =>{
          res.send(items)
          console.log('from data base',items);
        })
      })

      app.delete('/delete/:id', (req, res) => {
        const id = ObjectId (req.params.id);
        console.log('deleted id', id)
        cartCollection.findOneAndDelete({_id: id})
        .then(result => 
            {result.deletedCount > 0})
            
    })
    app.get('/order', (req, res) => {
        // const queryEmail = req.query.email;
        ordersCollection.find({email: req.query.email})
        .toArray((err, documents) => {
          res.send(documents)
          console.log(documents)
          console.log(err);
        })
      })
    // client.close();

});


app.listen(port)