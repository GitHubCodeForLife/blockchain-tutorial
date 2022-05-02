function formatString(str) {
  if (str.length > 10) {
    str = str.substring(0, 10);
    str = str + "...";
  }
  return str;
}
exports.formatString = formatString;
