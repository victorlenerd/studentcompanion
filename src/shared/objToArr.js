export default obj => {
  let results = [];
  const keys = Object.keys(obj);
  results = keys.map(key => {
    return Object.assign({}, obj[key], { id: key });
  });
  return results;
};
