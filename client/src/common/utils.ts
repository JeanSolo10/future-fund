export const isEmptyArray = (arr: Array<any>) => {
  if (Array.isArray(arr) && arr.length === 0) {
    return true;
  }
  return false;
};
