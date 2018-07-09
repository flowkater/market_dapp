import React, { Component } from 'react';

class ProductList extends Component {
  render() {
    return (
      <div className="product-list container">
        <div>Total Product Number: 3
        </div>
        <div className="row mt-3">
          <div className="col-md-2">
            <span>Categories</span>
          </div>
          <div className="col-md-10">
            <a onClick={() => {console.log("IT Book")}} href="#" className="badge badge-primary">IT Book</a>&nbsp;
            <a href="#" className="badge badge-secondary">Science</a>&nbsp;
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12">
            <h2 className="text-center">Product List</h2>  
          </div>
          <div className="col-md-12">
            <div className="row" id="product-list">
              <div className="product-item col-md-4 text-center">
                <img src="http://via.placeholder.com/150x350" alt="product"/>
                <div>Name: 이름</div>
                <div>Category: 카테고리</div>
                <div>설명링크: 설명링크</div>
                <div>가격: 가격 + Ether</div>
                <div>상태: 0</div>
              </div>
              <div className="product-item col-md-4 text-center">
                <img src="http://via.placeholder.com/150x350" alt="product"/>
                <div>Name: 이름</div>
                <div>Category: 카테고리</div>
                <div>설명링크: 설명링크</div>
                <div>가격: 가격 + Ether</div>
                <div>상태: 0</div>
              </div>
              <div className="product-item col-md-4 text-center">
                <img src="http://via.placeholder.com/150x350" alt="product"/>
                <div>Name: 이름</div>
                <div>Category: 카테고리</div>
                <div>설명링크: 설명링크</div>
                <div>가격: 가격 + Ether</div>
                <div>상태: 0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductList;