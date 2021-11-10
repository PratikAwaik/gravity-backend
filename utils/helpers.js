const filteredArray = (array, itemToRemove) => {
  return array.filter((item) => item.toString() !== itemToRemove.toString());
};

const paginateResults = (pageNumber, limit, results) => {
  return results.slice(pageNumber * limit - limit, pageNumber * limit);
};

module.exports = {
  filteredArray,
  paginateResults,
};
