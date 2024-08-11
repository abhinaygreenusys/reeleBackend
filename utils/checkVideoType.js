function checkVideoType(videoType) {
  const allowedTypes = ["public", "private", "favourite"];
  return allowedTypes.includes(videoType);
}

module.exports = checkVideoType;
