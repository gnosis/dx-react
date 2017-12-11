const EtherToken = artifacts.require('./Tokens/EtherToken.sol')
// use old TokenGNO contract for testing
const TokenGNO = artifacts.require('./TokenGNO.sol')

module.exports = (deployer, network, accounts) => {
  let ETH
  let GNO

  const [master, seller] = accounts
  deployer.then(() => {
    EtherToken.deployed().then((inst) => {
      ETH = inst
      ETH.approve(seller, 1000, { from: master })
    })
  })
  deployer.then(() => {
    TokenGNO.deployed().then((inst) => {
      GNO = inst
      GNO.approve(seller, 10000, { from: master })
    })
  })

  deployer.then(() => ETH.deposit({ value: 1000, from: seller }))
  deployer.then(() => GNO.transferFrom(master, seller, 1000, { from: seller }))

  deployer.then(() => ETH.balanceOf(seller))
    .then(bal => console.log('Seller ETH balance', bal.toNumber()))
  deployer.then(() => GNO.balanceOf(seller))
    .then(bal => console.log('Seller GNO balance', bal.toNumber()))
}
