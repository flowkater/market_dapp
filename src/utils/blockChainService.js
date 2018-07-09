import Web3 from 'web3'
import contract from 'truffle-contract'
import ipfsAPI from 'ipfs-api';
import MarketContract from "../../build/contracts/Market.json";

const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
let web3Instance;

let setWeb3Instance = function () {
  return new Promise((resolve, reject) => {
      if (web3Instance) {
          resolve();
      } else {
          // Wait for loading completion to avoid race conditions with web3 injection timing.
          window.addEventListener('load', function () {
            var web3 = window.web3
          //     // Checking if Web3 has been injected by the browser (Mist/MetaMask)
          //     if (typeof web3 !== 'undefined') {
          //         // Use Mist/MetaMask's provider.
          //         web3 = new Web3(web3.currentProvider)
          //         web3Instance = web3
          //     } else {
                  // Fallback to localhost if no web3 injection.
            var provider = new Web3.providers.HttpProvider('http://localhost:8545')
            web3 = new Web3(provider)
            web3Instance = web3
              // }
            resolve();
          })
      }
  })
}

let getMarketInstance = function () {
  return new Promise((resolve, reject) => {
    const Market = contract(MarketContract)
    Market.setProvider(web3Instance.currentProvider)
    web3Instance.eth.getAccounts((error, accounts) => {
      const account = accounts[0]
      Market.deployed().then((instance) => {
        resolve({ instance, account})
      })
    })
  })
}

let totalProductIndex = function () {
  return new Promise((resolve, reject) => {
    let instance, account;
    getMarketInstance()
      .then(result => ({instance, account} = result))
      .then(() => instance.totalProductIndex.call())
      .then(i => resolve(parseInt(i.toString())))
  })
}

let getProduct = function (i) {
  return new Promise((resolve, reject) => {
    let instance, account;
    getMarketInstance()
      .then(result => ({instance, account} = result))
      .then(() => instance.getProduct.call(i))
      .then(product => {
        // (product.id, product.name, product.category, product.imageLink, product.descLink, product.price, product.status, product.condition)
        resolve({ id: product[0].toString(),
                name: product[1].toString(),
            category: product[2].toString(), 
           imageLink: product[3].toString(),
            descLink: product[4].toString(), 
               price: product[5].toString(),
              status: product[6].toString(),
           condition: product[7].toString() })
      })
  })
}

let saveProduct = function(reader, params) {
  return new Promise((resolve, reject) => {
    console.log(reader, params);
    let imageId, descId;
    saveImageOnIpfs(reader).then(id => {
      imageId = id;
      saveTextBlobOnIpfs(params['description']).then(id => {
        descId = id;
        resolve(saveProductToBlockchanin(params, imageId, descId));
      })
    })
  })
}

let saveProductToBlockchanin = function(params, imageId, descId) {
  console.log(params, imageId, descId);
  return new Promise((resolve, reject) => {
    let instance, account;
    getMarketInstance()
      .then(result => ({instance, account} = result))
      .then(() => {
        resolve(instance.addProductToStore(
          params['name'], 
          params['category'], 
          imageId, 
          descId, 
          web3Instance.toWei(params['price'], 'ether'), 
          parseInt(params['condition']), {from: account, gas: 440000} ));
      })
  })
}

let saveImageOnIpfs = function (reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function(e) {
      const buffer = Buffer.from(reader.result);
      ipfs.add(buffer)
      .then((response) => {
        console.log(response)
        resolve(response[0].hash);
      }).catch((err) => {
        console.error(err)
        reject(err);
      })
    }
  })
}

let saveTextBlobOnIpfs = function (blob) {
  return new Promise(function(resolve, reject) {
   const descBuffer = Buffer.from(blob, 'utf-8');
   ipfs.add(descBuffer)
   .then((response) => {
    console.log(response)
    resolve(response[0].hash);
   }).catch((err) => {
    console.error(err)
    reject(err);
   })
  })
 }

export {
  totalProductIndex,
  saveProduct,
  getMarketInstance,
  getProduct,
  setWeb3Instance
}