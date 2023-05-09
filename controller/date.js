const getDate = function () {
  const today = new Date();
  const option = {
    day: "numeric",
    weekday: "long",
    month: "long",
    year: "numeric",
  };
  return today.toLocaleDateString("en-US", option);
};

module.exports = getDate;
