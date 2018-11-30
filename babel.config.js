// eslint-disable-next-line func-names
module.exports = function (api) {
  api.cache(true)

  const presets = [
    ['@babel/preset-env', { modules: 'commonjs' }],
    '@babel/preset-react',
  ]

  const plugins = [
    // 'react-hot-loader/babel',
    '@babel/plugin-proposal-object-rest-spread',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/transform-runtime',
      {
        regenerator: true,
      },
    ],
  ]

  return { presets, plugins }
}
