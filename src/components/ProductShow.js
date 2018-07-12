import React, { Component } from 'react';
import { 
  ipfs, 
  setWeb3Instance, 
  getProduct, 
  buyProduct, 
  getEscrowInfo, 
  releaseAmountToSeller,
  refundAmountToBuyer } from '../utils/blockChainService';
import { productStatus, productCondition } from "../utils/libs";

class ProductShow extends Component {
  state = {
    amount: 0,
    product: {
      id: '',
      name: '',
      category: '',
      imageLink: '',
      descLink: '',
      price: '',
      status: 0,
      description: ''
    },
    escrowInfo: {
      buyer: '',
      seller: '',
      arbiter: '',
      fundsDisbursed: '',
      releaseCount: '',
      refundCount: ''
    }
  }

  
  componentWillMount() {
    const id = this.props.match.params.id;
    
    setWeb3Instance()
    .then(() => getProduct(id))
    .then(product => this.setState({product: product}))
    .then(() => console.log(this.state.product))
    .then(() => {
      let product = this.state.product;
      ipfs.cat(this.state.product.descLink).then(file => {
        product.description = file.toString();
        return product;
      }).then((product) => this.setState({product: product}))
    }).then(() => {
      if(this.state.product.status == 1) {
        getEscrowInfo(id)
        .then(escrowInfo => this.setState({escrowInfo: escrowInfo}))
        .then(() => console.log(this.state.escrowInfo));
      }
    })  
  }
  

  handleChange = (e) => {
    this.setState({amount: e.target.value});
  }

  handleSubmit = (e) => {
    const { amount, product } = this.state
    e.preventDefault();
    console.log(amount);

    setWeb3Instance()
    .then(() => buyProduct(product.id, amount))
    .then(() => getProduct(product.id))
    .then(product => {
      this.setState({product: product})
    }).then(() => getEscrowInfo(product.id))
    .then(escrowInfo => this.setState({escrowInfo: escrowInfo}))
    .then(() => console.log(this.state.escrowInfo));
  }


  releaseAmountToSeller(id, sender) {
    setWeb3Instance()
      .then(() => releaseAmountToSeller(id, sender))
      .then(result => console.log(result))
      .then(() => getEscrowInfo(id))
      .then(escrowInfo => this.setState({escrowInfo: escrowInfo}))
      .then(() => console.log(this.state.escrowInfo));
  }

  refundAmountToBuyer(id, sender) {
    setWeb3Instance()
      .then(() => refundAmountToBuyer(id, sender))
      .then(result => console.log(result))
      .then(() => getEscrowInfo(id))
      .then(escrowInfo => this.setState({escrowInfo: escrowInfo}))
      .then(() => console.log(this.state.escrowInfo));
  }

  handleCount = (e) => {
    const { product, escrowInfo} = this.state;
    const buttonName = e.target.name;
    const type = buttonName.split('-')[0]
    const sender = buttonName.split('-')[1]
    console.log(type, sender)

    if(type === "release") {
      if(sender === "buyer") {
        this.releaseAmountToSeller(product.id, escrowInfo.buyer)
      } else if (sender === "seller") {
        this.releaseAmountToSeller(product.id, escrowInfo.seller)
      } else if (sender === "arbiter") {
        this.releaseAmountToSeller(product.id, escrowInfo.arbiter)
      }
    } else if (type === "refund") {
      if(sender === "buyer") {
        this.refundAmountToBuyer(product.id, escrowInfo.buyer)
      } else if (sender === "seller") {
        this.refundAmountToBuyer(product.id, escrowInfo.seller)
      } else if (sender === "arbiter") {
        this.refundAmountToBuyer(product.id, escrowInfo.arbiter)
      }
    }
  }


  render() {
    const { product, escrowInfo } = this.state;
    const EscrowInfo =  (
      <div>
        <h4>Escrow Information</h4>
        <div>
          Buyer Address: {escrowInfo.buyer}
        </div>
        <div>
          Seller Address: {escrowInfo.seller}
        </div>
        <div>
          Arbiter Address: {escrowInfo.arbiter}
        </div>
        <div>
          Release Count: {escrowInfo.releaseCount}
        </div>
        <div>
          Refund Count: {escrowInfo.refundCount}
        </div>
        <div>
          Funds Disbursed: {escrowInfo.fundsDisbursed}
        </div>
      </div>
    );

    const EscrowBtn = (
      <div>
        <div className="col-md-6">
          <button onClick={this.handleCount} name="release-buyer" className="btn btn-success mt-2">Release By Buyer</button>
          <button onClick={this.handleCount} name="release-seller" className="btn btn-success mt-2">Release By Seller</button>
          <button onClick={this.handleCount} name="release-arbiter" className="btn btn-success mt-2">Release By Arbiter</button>
        </div>
        <div className="col-md-6">
          <button onClick={this.handleCount} name="refund-buyer" className="btn btn-warning mt-2">Refund By Buyer</button>
          <button onClick={this.handleCount} name="refund-seller" className="btn btn-warning mt-2">Refund By Seller</button>
          <button onClick={this.handleCount} name="refund-arbiter" className="btn btn-warning mt-2">Refund By Arbiter</button>
        </div>
      </div>
    )

    const BuyForm = (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="actual-amount">Amount Ether</label>
          <input 
            type="number" 
            value={this.state.amount}
            className="form-control" 
            name="amount" 
            required="required"
            onChange={this.handleChange} />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Buy</button>
        </div>
      </form>
    )

    return (
      <div className="product-show container">
        <h1>Product Details</h1>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div id="image">
                {product.imageLink ? 
                  <img src={`https://ipfs.io/ipfs/` + product.imageLink} alt="product" width={250} />
                  : null
                }
              </div>
              <div id="category">
                Category: {product.category}
              </div>
              <div id="name">
                Name: {product.name}
              </div>
              <div id="price">
                가격: {product.price}
              </div>
              <div id="condition">
                사용 유무: {product.condition ? productCondition(product.condition) : null}
              </div>
              <div id="status">
                상태: {product.status ? productStatus(product.status) : null}
              </div>

              {
                product.status ?
                  (parseInt(product.status, 10) === 1 ?
                    EscrowInfo
                  : null)
                : null
              }
              
            </div>
            <div className="col-md-4">
              <h4>Product Description</h4>
              {product.description}
            </div>
            <div className="col-md-4">
              {
                product.status ?
                  (parseInt(product.status, 10) === 0 ?
                    BuyForm
                  : null)
                : null
              }
              <div className="row">
                {
                  product.status ?
                    (parseInt(product.status, 10) === 1 ?
                      EscrowBtn
                    : null)
                  : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductShow;