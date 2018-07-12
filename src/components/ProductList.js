import React, { Component } from 'react';
import { uniq, productStatus, productCondition } from "../utils/libs";
import { Link } from 'react-router-dom'
import axios from 'axios';

class ProductList extends Component {
  state = {
    products : [
    ]
  }

  
  componentWillMount() {
    axios.get('http://localhost:3001/products')
    .then(response => this.setState({products: response.data}));
  }


  render() {
    const { products } = this.state;

    return (
      <div className="product-list container">
        <div>Total Product Number: {products.length}
        </div>
        <div className="row mt-3">
          <div className="col-md-2">
            <span>Categories</span>
          </div>
          <div className="col-md-10">
            {uniq(products.map((product) => product.category)).map((category, i) => (
              <CategoryLink key={i} category={category} />
            ))}
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12">
            <h2 className="text-center">Product List</h2>  
          </div>
          <div className="col-md-12">
            <div className="row" id="product-list">
              {products.map((product, i) => (
                <Product key={i} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CategoryLink extends Component {
  render () {
    return (
      <a 
          onClick={() => {console.log("IT Book")}} 
          href="#" 
          className="badge badge-primary"
        >{this.props.category}&nbsp;
      </a>
    )
  }
}

class Product extends Component {
  render() {
    const { product } = this.props;

    return (
      <div className="product-item col-md-4 text-center">
        <img src={`https://ipfs.io/ipfs/` + product.imageLink} alt="product" width={150} />
        <div>Name: {product.name}</div>
        <div>Category: {product.category}</div>
        <div>가격: {product.price} Wei</div>
        <div>사용: {product ? productCondition(product.condition) : null}</div>
        <div>상태: {product ? productStatus(product.status) : null}</div>
        <div><Link to={`/products/` + product.blockchainId}>제품 상세 정보</Link></div>
      </div>
    );
  }
}

export default ProductList;