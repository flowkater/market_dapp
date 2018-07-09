import React, { Component } from 'react';
import { setWeb3Instance, saveProduct } from "../utils/blockChainService";

class UploadProduct extends Component {
  state = {
    name: '',
    description: '',
    image: null,
    category: '',
    price: 0,
    condition: 0,
    options: [
      'Art',
      'Books',
      'Cameras',
      'Cell Phones & Accessories',
      'Clothing',
      'Coins & Paper Money',
      'Collectibles',
      'Computers/Tablets & Networking',
      'Consumer Electronics',
      'Crafts',
      'DVDs & Movies',
      'Entertainment Memorabilia',
      'Gift Cards & Coupons',
      'Music',
      'Musical Instruments & Gear',
      'Pet Supplies',
      'Pottery & Glass',
      'Sporting Goods',
      'Stamps',
      'Tickets',
      'Toys & Hobbies',
      'Video Games',
    ],
    show: false
  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  fileChangedHandler = (e) => {
    this.setState({image: e.target.files[0]})
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(this.state.image);

    setWeb3Instance()
    .then(() => saveProduct(reader, this.state))
    .then(() => this.setState({show: true, name: '', description: '', image: null, category: '', price: 0, condition: 0}))
  }

  
  render() {
    return (
       <div className="container">
        <h1>Upload Product Item</h1>
        <div className="container">
          {this.state.show ? 
            <div className="alert alert-success" role="alert">
              Successful Updated Product Item
            </div> : null
          }
          <div className="row">
            <form 
              className="form-horizontal col-sm-5" 
              id="add-item-to-store" 
              onSubmit={this.handleSubmit} >
              <div className="form-group">
                <label htmlFor="product-name" className="col-sm-2 control-label">Name</label>
                <div className="col-sm-10">
                <input 
                  type="text" 
                  name="name" 
                  className="form-control" 
                  id="name" 
                  placeholder="iPhone, Jeans, shoes etc" 
                  required="required"
                  value={this.state.name}
                  onChange={this.handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="product-description" className="col-sm-2 control-label">Description</label>
                <div className="col-sm-10">
                <textarea 
                  className="form-control" 
                  name="description" 
                  rows="8" 
                  id="description" 
                  placeholder="Enter detailed product description" 
                  required="required" 
                  value={this.state.description} 
                  onChange={this.handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="image" className="col-sm-2 control-label">Upload product photo</label>
                <div className="col-sm-10">
                <input 
                  type="file" 
                  name="image" 
                  className="form-control" 
                  id="image" 
                  required="required"
                  onChange={this.fileChangedHandler} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="category" className="col-sm-2 control-label">Category</label>
                <div className="col-sm-10">
                <select 
                  className="form-control" 
                  name="category" 
                  id="category"
                  value={this.state.category}
                  onChange={this.handleInputChange}
                  >
                  {this.state.options.map((option, i) => (
                    <option key={i}>{option}</option>  
                  ))}
                </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="price" className="col-sm-2 control-label">Price</label>
                <div className="col-sm-10">
                <input 
                  type="number" 
                  className="form-control" 
                  name="price" 
                  id="price" 
                  required="required" 
                  value={this.state.price}
                  onChange={this.handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="condition" className="col-sm-2 control-label">Product Condition</label>
                <div className="col-sm-10">
                <select 
                  className="form-control" 
                  name="condition" 
                  id="condition"
                  value={this.state.condition}
                  onChange={this.handleInputChange}
                  >
                  <option value="0">New</option>
                  <option value="1">Used</option>
                </select>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                <button type="submit" className="btn btn-primary">Add Product To Store</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadProduct;