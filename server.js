var MarketContract = require('./build/contracts/Market.json')
var contract = require('truffle-contract')
var Web3 = require('web3')
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var Market = contract(MarketContract);
Market.setProvider(provider);

//Mongoose setup to interact with the mongodb database 
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ProductModel = require('./product');
mongoose.connect("mongodb://localhost:27017/market_dapp");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Express server which the frontend with interact with
var express = require('express');
var app = express();

app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

app.listen(3001, function() {
 console.log('Market Ethereum server listening on port 3001!');
});

function setupProductEventListner() {
 let productEvent;
 Market.deployed().then(function(i) {
  productEvent = i.NewProduct({fromBlock: 0, toBlock: 'latest'});

  productEvent.watch(function(err, result) {
   if (err) {
    console.log(err)
    return;
   }
   saveProduct(result.args);
  });
 })
}

setupProductEventListner();

function saveProduct(product) {
 ProductModel.findOne({ 'blockchainId': product._productId.toLocaleString() }, function (err, dbProduct) {

  if (dbProduct != null) {
   return;
  }

  var p = new ProductModel({name: product._name, blockchainId: product._productId, category: product._category,
   imageLink: product._imageLink, descLink: product._descLink, price: product._price, condition: product._productCondition,
   status: 0});
  p.save(function (err) {
   if (err) {
    handleError(err);
   } else {
    ProductModel.count({}, function(err, count) {
     console.log("count is " + count);
    })
   }
  });
 })
}

app.get('/products', function(req, res) {
  query = { status: {$eq: 0} }
 
  ProductModel.find(query, null, {}, function (err, items) {
   console.log(items.length);
   res.send(items);
  })
 });