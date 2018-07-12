import Web3 from 'web3'
import contract from 'truffle-contract'
import ipfsAPI from 'ipfs-api';
import MarketContract from "../../build/contracts/Market.json";

const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});
let web3Instance;

const setWeb3Instance = () => {
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

const getMarketInstance = () => {
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

const getMarketInstanceBuyerAccount = () => {
  return new Promise((resolve, reject) => {
    const Market = contract(MarketContract)
    Market.setProvider(web3Instance.currentProvider)
    web3Instance.eth.getAccounts((error, accounts) => {
      const account = accounts[1]
      Market.deployed().then((instance) => {
        resolve({ instance, account})
      })
    })
  })
}


// Market.deployed().then(f => {f.buy(2, {value: web3.toWei(1, 'ether'), from: web3.eth.accounts[1]}) }).then(f => console.log(f))

const buyProduct = (productId, amount) => {
  return new Promise((resolve, reject) => {
    let instance, account;
    getMarketInstanceBuyerAccount()
      .then(result => ({instance, account} = result))
      .then(() => {
        resolve(instance.buy(parseInt(productId, 10), 
            {
              value: web3Instance.toWei(amount, 'ether'), 
              from: account, 
              gas: 4400000
            }))
      })
  })
}

const getEscrowInfo = (productId) => {
  return new Promise((resolve, reject) => {
    let instance, account;
    getMarketInstance()
      .then(result => ({instance, account} = result))
      .then(() => instance.escrowInfo.call(parseInt(productId, 10)))
      .then(escrowInfo => {
        resolve({
          buyer: escrowInfo[0].toString(),
          seller: escrowInfo[1].toString(),
          arbiter: escrowInfo[2].toString(),
          fundsDisbursed: escrowInfo[3].toString(),
          releaseCount: escrowInfo[4].toString(),
          refundCount: escrowInfo[5].toString(),
        })
      })
  })
}

const releaseAmountToSeller = (productId, address) => {
  return new Promise((resolve, reject) => {
    let instance, account;
    getMarketInstance()
      .then(result => ({instance, account} = result))
      .then(() => resolve(instance.releaseAmountToSeller(parseInt(productId, 10),{
        from: address,
        gas: 4400000
      })))
  })
}

const refundAmountToBuyer = (productId, address) => {
  return new Promise((resolve, reject) => {
    let instance, account;
    getMarketInstance()
      .then(result => ({instance, account} = result))
      .then(() => resolve(instance.refundAmountToBuyer(parseInt(productId, 10),{
        from: address,
        gas: 4400000
      })))
  })
}

const getProduct = (i) => {
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
               price: web3Instance.fromWei(parseInt(product[5].toString(), 10), 'ether'),
              status: product[6].toString(),
           condition: product[7].toString() })
      })
  })
}

const saveProductToBlockchanin = (params, imageId, descId) => {
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
          parseInt(params['condition'], 10), {from: account, gas: 440000} ));
      })
  })
}

const saveImageOnIpfs = (reader) => {
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
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

const saveTextBlobOnIpfs = (blob) => {
  return new Promise((resolve, reject) => {
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


const saveProduct = (reader, params) => {
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


export {
  releaseAmountToSeller,
  refundAmountToBuyer,
  getEscrowInfo,
  web3Instance,
  ipfs,
  saveProduct,
  getMarketInstance,
  getProduct,
  buyProduct,
  setWeb3Instance
}