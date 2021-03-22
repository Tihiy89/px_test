console.info('------------------------------');
console.info(`NODE_ENV: ${process.env.NODE_ENV}`);
console.info('------------------------------');

module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}