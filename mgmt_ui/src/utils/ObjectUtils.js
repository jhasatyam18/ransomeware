// Insert a object item at a specified position
export function addItemAtPosition(config, position, key, value) {
  const childrenArray = Object.entries(config);
  const newItem = [key, value];
  childrenArray.splice(position, 0, newItem);
  const updatedEntries = Object.fromEntries(childrenArray);
  return updatedEntries;
}
