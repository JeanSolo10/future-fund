export const isEmptyArray = (arr: Array<any>) => {
  if (Array.isArray(arr) && arr.length === 0) {
    return true;
  }
  return false;
};

export const isEmptyObject = (obj: any) => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  return Object.keys(obj).length === 0;
};
