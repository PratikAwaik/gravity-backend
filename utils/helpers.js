const filteredArray = (array, itemToRemove) => {
  return array.filter((item) => item.toString() !== itemToRemove.toString());
};

const paginateResults = (pageNumber, limit, results) => {
  return results.slice(pageNumber * limit - limit, pageNumber * limit);
};

const transformModel = (document, returnedObject) => {
  returnedObject.id = returnedObject._id;
  delete returnedObject._id;
  delete returnedObject.__v;
};

module.exports = {
  filteredArray,
  paginateResults,
  transformModel,
};
