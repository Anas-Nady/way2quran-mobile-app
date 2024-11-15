const truncateName = (str, maxLength = 26) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "..";
  }
  return str;
};

export default truncateName;
