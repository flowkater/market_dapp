pragma solidity ^0.4.24;

contract Market {
  enum ProductStatus { Open, Sold, Unsold }
  enum ProductCondition { New, Used }

  uint public productIndex;
  mapping (address => mapping(uint => Product)) stores;
  mapping (uint => address) productIdInStore;

  struct Product {
    uint id;
    string name;
    string category;
    string imageLink;
    string descLink;
    uint price;
    address buyer;
    ProductStatus status;
    ProductCondition condition;

    mapping (address => BuyInfo) buyInfos;
  }

  /* 구매 정보 구조체 */
  struct BuyInfo {
    address buyer;
    uint productId;
    uint value;
  }

  constructor() public {
    productIndex = 0;
  }

  function addProductToStore(string _name, string _category, string _imageLink, string _descLink, uint _price, uint _productCondition) public {
    productIndex += 1;
    Product memory product = Product(productIndex, _name, _category, _imageLink, _descLink, _price, 0, ProductStatus.Open, ProductCondition(_productCondition));
    stores[msg.sender][productIndex] = product;
    productIdInStore[productIndex] = msg.sender;
  }

  // price 는 wei 단위로
  function getProduct(uint _productId) view public returns (uint, string, string, string, string, uint, ProductStatus, ProductCondition) {
    Product memory product = stores[productIdInStore[_productId]][_productId];
    return (product.id, product.name, product.category, product.imageLink, product.descLink, product.price, product.status, product.condition);
  }

  function buy(uint _productId) payable public returns (bool) {
    Product storage product = stores[productIdInStore[_productId]][_productId];
    require(msg.value == product.price);
    require(product.buyInfos[msg.sender].buyer == 0);
    product.buyInfos[msg.sender] = BuyInfo(msg.sender, _productId, msg.value);

    return true;
  }
}