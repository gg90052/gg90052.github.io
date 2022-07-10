export const removeInArray = (target, arr, objectKey:any = undefined) => {
  arr.forEach((item, index) => {
    if (objectKey) {
      if (item[objectKey] === target[objectKey]) {
        arr.splice(index, 1);
      }
    }else{
      if (item === target) {
        arr.splice(index, 1);
      }
    }
  });
  return arr;
}