import "./Escrow.sol";
pragma solidity ^0.4.24;

contract Market {
  enum ProductStatus { Open, Sold }
  enum ProductCondition { New, Used }

  uint public productIndex;
  mapping (address => mapping(uint => Product)) stores;
  mapping (uint => address) productIdInStore;
  mapping (uint => address) productEscrow;

  event NewProduct(uint _productId, string _name, string _category, string _imageLink, string _descLink, uint _price, uint _productCondition);

  struct Product {
    uint id;
    string name;
    string category;
    string imageLink;
    string descLink;
    uint price;
    ProductStatus status;
    ProductCondition condition;
    address buyer;
  }

  constructor() public {
    productIndex = 0;
  }

  function addProductToStore(string _name, string _category, string _imageLink, string _descLink, uint _price, uint _productCondition) public {
    productIndex += 1;
    Product memory product = Product(productIndex, _name, _category, _imageLink, _descLink, _price, ProductStatus.Open, ProductCondition(_productCondition), address(0));
    stores[msg.sender][productIndex] = product;
    productIdInStore[productIndex] = msg.sender;
    emit NewProduct(productIndex, _name, _category, _imageLink, _descLink, _price, _productCondition);
  }

  // price 는 wei 단위로
  function getProduct(uint _productId) view public returns (uint, string, string, string, string, uint, ProductStatus, ProductCondition) {
    Product memory product = stores[productIdInStore[_productId]][_productId];
    return (product.id, product.name, product.category, product.imageLink, product.descLink, product.price, product.status, product.condition);
  }

  function buy(uint _productId) payable public {
    Product memory product = stores[productIdInStore[_productId]][_productId];
    require(msg.value == product.price);
    require(product.buyer == address(0));
    product.buyer = msg.sender;
    product.status = ProductStatus.Sold;
    stores[productIdInStore[_productId]][_productId] = product;
    Escrow escrow = (new Escrow).value(msg.value)(_productId, product.buyer, productIdInStore[_productId], msg.sender);

    productEscrow[_productId] = address(escrow);
  }

  function releaseAmountToSeller(uint _productId) public {
    Escrow(productEscrow[_productId]).releaseAmountToSeller(msg.sender);
  }

  function refundAmountToBuyer(uint _productId) public {
    Escrow(productEscrow[_productId]).refundAmountToBuyer(msg.sender);
  }

  function escrowAddressForProduct(uint _productId) view public returns (address) {
    return productEscrow[_productId];
  }

  function escrowInfo(uint _productId) view public returns (address, address, address, bool, uint, uint) {
    return Escrow(productEscrow[_productId]).escrowInfo();
  }
}