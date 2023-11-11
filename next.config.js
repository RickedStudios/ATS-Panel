const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const plugins = [
  [
    withLess,
    {
      lessLoaderOptions: {
        // Add any Less loader options you need here
      },
    },
  ],
];

module.exports = withPlugins(plugins, {
  reactStrictMode: true,
  swcMinify: true,
});