/* eslint-disable no-console */
const HDWalletProvider = require('truffle-hdwallet-provider')
const assert = require('assert')

const DEFAULT_GAS_PRICE_GWEI = 5
const GAS_LIMIT = 6.5e6
const DEFAULT_MNEMONIC = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'

function truffleConfig({
  mnemonic = DEFAULT_MNEMONIC,
  gasPriceGWei = DEFAULT_GAS_PRICE_GWEI,
  gas = GAS_LIMIT,
  optimizedEnabled = false,
  urlRinkeby = 'https://rinkeby.infura.io/',
  urlMainnet = 'https://mainnet.infura.io',
  urlDevelopment = 'localhost',
  portDevelopment = 8545,
} = {}) {
  assert(mnemonic, 'The mnemonic has not been provided')
  console.log(`Using gas limit: ${gas / 1000} K`)
  console.log(`Using gas price: ${gasPriceGWei} Gwei`)
  console.log(`Optimizer enabled: ${optimizedEnabled}`)
  console.log('Using default mnemonic: %s', mnemonic === DEFAULT_MNEMONIC)
  const gasPrice = gasPriceGWei * 1e9

  // eslint-disable-next-line no-underscore-dangle
  const _getProvider = url => () => new HDWalletProvider({ mnemonic, url })

  return {
    networks: {
      development: {
        host: urlDevelopment,
        port: portDevelopment,
        gas,
        gasPrice,
        network_id: '*',
      },
      mainnet: {
        provider: _getProvider(urlMainnet),
        network_id: '1',
        gas,
        gasPrice,
      },
      rinkeby: {
        provider: _getProvider(urlRinkeby),
        network_id: '4',
        gas,
        gasPrice,
      },
    },
    solc: {
      optimizer: {
        enabled: optimizedEnabled,
      },
    },
  }
}

module.exports = truffleConfig({
  optimizedEnabled: true,
})
