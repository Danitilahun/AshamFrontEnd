const joinArraysById = (array1, array2) => {
  const result = {};

  const mapArray1 = array1.reduce((acc, obj) => {
    acc[obj.id] = obj;
    return acc;
  }, {});

  for (const obj of array2) {
    if (mapArray1[obj.id]) {
      const joinedObj = {
        ...mapArray1[obj.id],
        ...obj,
      };
      result[obj.id] = joinedObj;
    }
  }

  return Object.values(result);
};

module.exports = joinArraysById;
