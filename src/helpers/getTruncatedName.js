const truncateName = (str, maxLength = 21) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
};

export default truncateName;
