import React, { Component } from 'react'
import ProductList from "./components/ProductList";

class App extends Component {
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
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <div className="navbar-brand">Escrow Market</div>
            <ul className="navbar-nav">
              <li>
                <a href="#" className="nav-link">Upload Product</a>
              </li>
            </ul>
          </div>
        </nav>
        <ProductList />
      </div>
    );
  }
}

export default App
