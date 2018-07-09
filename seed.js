var Market = artifacts.require("./Market.sol");

module.exports = function(callback) {
  var amt_1 = web3.toWei(1, 'ether'); 
  Market.deployed().then(function(i) {i.addProductToStore('Mastering Bitcoin', 'IT Book', 'QmdxLyAeTRXCkNmwQYaJkYfeoGYD5sDeLfhnsXpU47g3pW', 'QmbZFDi8P4jeKnNCN7JJJ7rdBWVhKn8qT1NSnGSLnxTyZW', 2 * amt_1, 1).then(function(f) {console.log(f)})});
  Market.deployed().then(function(i) {i.addProductToStore('Core Ethereum Programming', 'IT Book', 'QmT6EqsJEzuQLnov9opAkwnbHkKSdSjWxDMrZuTAD22DrK', 'QmZhB9Rkr2zrx9ST4YHKAeFbj6qwydLQLUidY9VYUGw2QL', amt_1, 0).then(function(f) {console.log(f)})});
  Market.deployed().then(function(i) {i.addProductToStore('What is the Blockchain?', 'IT Book', 'QmWxDNXbhYMiMKRjTqeFsue2E2ejXCQXB319FU5oNzYipT', 'QmRpRGJRvs5MG4zfnvXDTySuaBU6WcziyXAEiipY3xjgdb', 3 * amt_1, 0).then(function(f) {console.log(f)})});
}