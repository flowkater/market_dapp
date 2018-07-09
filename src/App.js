import React, { Component } from 'react'
import ProductList from "./components/ProductList";
import { Switch, Route, Link } from 'react-router-dom'
import UploadProduct from './components/UploadProduct';

class App extends Component {
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
        </Switch>
      </div>
    );
  }
}

export default App
