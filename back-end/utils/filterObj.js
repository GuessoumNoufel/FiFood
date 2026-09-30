function filteredObj(obj, ...allowfields) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowfields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
}

module.exports = filteredObj;
