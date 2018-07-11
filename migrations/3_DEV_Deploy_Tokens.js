const TokenOMG = artifacts.require('TokenOMG')
const TokenRDN = artifacts.require('TokenRDN')

module.exports = (deployer, network) => {
  if (network === 'development') return deployer.deploy(TokenOMG, 50000e18).then(() => deployer.deploy(TokenRDN, 50000e18))

  return console.log('Not running on development, skipping.')
}
