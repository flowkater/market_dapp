const uniq = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) === pos;
  });
}

const productStatus = (status) => {
  const stat = parseInt(status, 10)
  switch (stat) {
    case 0:
      return "Open"
    case 1:
      return "Sold"
    case 2:
      return "Pending"
    default:
      break;
  }
}

const productCondition = (condition) => {
  const condi = parseInt(condition, 10)
  switch (condi) {
    case 0:
      return "New"
    case 1:
      return "Used"
    default:
      break;
  }
}

export { uniq, productStatus, productCondition };

// enum ProductStatus { Open, Sold, Pending }
//   enum ProductCondition { New, Used }