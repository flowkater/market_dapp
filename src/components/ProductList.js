import React, { Component } from 'react';
import { uniq } from "../utils/libs";

class ProductList extends Component {
  state = {
    products : [
      {
        id: 1, 
        name: 'Mastering Bitcoin', 
        category: 'IT Book', 
        imageLink: 'QmdxLyAeTRXCkNmwQYaJkYfeoGYD5sDeLfhnsXpU47g3pW', 
        descLink: 'QmbZFDi8P4jeKnNCN7JJJ7rdBWVhKn8qT1NSnGSLnxTyZW',
        price: 2000000,
        codition: 1
      },
      {
        id: 2, 
        name: 'Core Ethereum Programming', 
        category: 'IT Book', 
        imageLink: 'QmT6EqsJEzuQLnov9opAkwnbHkKSdSjWxDMrZuTAD22DrK', 
        descLink: 'QmZhB9Rkr2zrx9ST4YHKAeFbj6qwydLQLUidY9VYUGw2QL',
        price: 1000000,
        codition: 0
      },
      {
        id: 3, 
        name: 'What is the Blockchain?', 
        category: 'IT Book', 
        imageLink: 'QmWxDNXbhYMiMKRjTqeFsue2E2ejXCQXB319FU5oNzYipT', 
        descLink: 'QmRpRGJRvs5MG4zfnvXDTySuaBU6WcziyXAEiipY3xjgdb',
        price: 3000000,
        codition: 0
      }
    ]
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
        <img src="http://via.placeholder.com/150x350" alt="product"/>
        <div>Name: {product.name}</div>
        <div>Category: {product.category}</div>
        <div>설명링크: {product.descLink}</div>
        <div>가격: {product.prict} + Ether</div>
        <div>상태: {product.condition}</div>
      </div>
    );
  }
}

export default ProductList;