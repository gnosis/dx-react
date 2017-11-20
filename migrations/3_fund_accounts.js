const TokenETH = artifacts.require('./TokenETH.sol')

module.exports = (deployer) => {
  let ETH
  deployer.then(() => {
    TokenETH.deployed().then((inst) => {
      ETH = inst
      ETH.approve('0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', 100, { from: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1' })
    })
  })

  deployer.then(() => ETH.transferFrom('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0', 100, { from: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0' }))
  deployer.then(() => ETH.balanceOf('0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'))
    .then(bal => console.log(bal))
}
