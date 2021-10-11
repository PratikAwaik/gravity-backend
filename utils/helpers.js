const filteredArray = (array, itemToRemove) => {
  return array.filter((item) => item.toString() !== itemToRemove.toString());
};

module.exports = {
  filteredArray,
};
