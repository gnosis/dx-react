const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

const nodeEnv = process.env.NODE_ENV || 'development'
const version = process.env.BUILD_VERSION || pkg.version
const build = process.env.BUILD_NUMBER || 'SNAPSHOT'

const config = require('./src/config.json')

let whitelist

if (nodeEnv === 'development') {
  whitelist = config.developmentWhitelist
} else {
  whitelist = config.productionWhitelist
}


const gnosisDbUrl =
  process.env.GNOSISDB_URL || `${config.gnosisdb.protocol}://${config.gnosisdb.host}:${config.gnosisdb.port}`

const ethereumUrl =
  process.env.ETHEREUM_URL || `${config.ethereum.protocol}://${config.ethereum.host}:${config.ethereum.port}`

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: ['react-hot-loader/patch', 'bootstrap-loader', 'index.js'],
  devtool: 'eval',
  output: {
    publicPath: '/',
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  resolve: {
    symlinks: false,
    modules: [
      `${__dirname}/src`,
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(jpe?g|png|svg)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          },
        },
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          { loader: 'less-loader', options: { strictMath: true } },
        ],
      },
      {
        test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
      },
    ],
  },
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    port: 5000,
    clientLogLevel: 'info',
    hot: true,
    proxy: {
      '/api': {
        target: gnosisDbUrl,
        secure: false,
      },
    },
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new FaviconsWebpackPlugin({
      logo: 'assets/img/gnosis_logo_favicon.png',
      // Generate a cache file with control hashes and
      // don't rebuild the favicons until those hashes change
      persistentCache: true,
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/html/index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(`${version}#${build}`),
        NODE_ENV: JSON.stringify(nodeEnv),
        GNOSISDB_URL: JSON.stringify(gnosisDbUrl),
        ETHEREUM_URL: JSON.stringify(ethereumUrl),
        WHITELIST: JSON.stringify(whitelist),
      },
    }),
  ],
}
