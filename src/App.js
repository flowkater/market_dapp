import React, { Component } from 'react'
import ProductList from "./components/ProductList";
import { Switch, Route, Link } from 'react-router-dom'
import UploadProduct from './components/UploadProduct';
import { setWeb3Instance } from "./utils/blockChainService";
import ProductShow from './components/ProductShow';

class App extends Component {
  
  componentWillMount() {
    setWeb3Instance()
  }
  

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link to="/" className="navbar-brand">Escrow Market</Link>
            <ul className="navbar-nav">
              <li>
                <Link to="/upload" className="nav-link">Upload Product</Link>
              </li>
            </ul>
          </div>
        </nav>
        <Switch>
          <Route exact path='/' component={ProductList} />
          <Route path='/upload' component={UploadProduct} />
          <Route path='/products/:id' component={ProductShow} />
        </Switch>
      </div>
    );
  }
}

export default App
