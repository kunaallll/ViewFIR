const path = require('path-browserify');

module.exports = {
  // other webpack configuration
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    }
  }
};