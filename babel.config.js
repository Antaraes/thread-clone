module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'nativewind/babel',
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
          assets: './src/assets',
          redux: './src/redux',
          components: './src/components',
          helpers: './src/helpers',
          navigation: './src/navigation',
          screens: './src/screens',
          services: './src/services',
          utils: './src/utils',
          constants: './src/constants',
        },
      },
    ],
  ],
};
