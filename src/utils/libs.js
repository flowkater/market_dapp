const uniq = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) === pos;
  });
}

export { uniq };