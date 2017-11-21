const TokenETH = artifacts.require('./TokenETH.sol')
const TokenGNO = artifacts.require('./TokenGNO.sol')

module.exports = (deployer, network, accounts) => {
  let ETH
  let GNO

  const [master, seller, buyer] = accounts
  deployer.then(() => {
    TokenETH.deployed().then((inst) => {
      ETH = inst
      ETH.approve(seller, 100, { from: master })
    })
  })
  deployer.then(() => {
    TokenGNO.deployed().then((inst) => {
      GNO = inst
      GNO.approve(buyer, 10000, { from: master })
    })
  })

  deployer.then(() => ETH.transferFrom(master, seller, 100, { from: seller }))
  deployer.then(() => GNO.transferFrom(master, buyer, 1000, { from: buyer }))

  deployer.then(() => ETH.balanceOf(seller))
    .then(bal => console.log('Seller ETH balance', bal.toNumber()))
  deployer.then(() => GNO.balanceOf(buyer))
    .then(bal => console.log('Buyer GNO balance', bal.toNumber()))
}
