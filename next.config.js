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
  amp: {
    // Define your AMP configuration here
    canonicalBase: '/your-canonical-base',
  },
  assetPrefix: '/your-asset-prefix',
  i18n: {
    // Define your i18n configuration here
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  images: {
    // Define your images configuration here
    loader: 'default',
  },
});
