const TokenETH = artifacts.require('./TokenETH.sol')
const TokenGNO = artifacts.require('./TokenGNO.sol')

const argv = require('minimist')(process.argv.slice(2), { string: 'a' })

/**
 * truffle exec trufflescripts/give_tokens.js
 * give tokens from master
 * @flags:
 * --seller           to seller
 * --buyer            to buyer
 * -a <address>       to the given address
 * --eth <number>     ETH tokens
 * --gno <number>     GNO tokens
 */

module.exports = async () => {
  if (!(argv.eth || argv.gno) || !(argv.seller || argv.buyer || argv.a)) {
    console.warn('No tokens or accounts specified')
    return
  }

  // web3 is available in the global context
  const [master, seller, buyer] = web3.eth.accounts
  const account = argv.seller ? seller : argv.buyer ? buyer : argv.a
  const accountName = argv.seller ? 'Seller' : argv.buyer ? 'Buyer' : `Acc ${argv.a}`

  const eth = await TokenETH.deployed()
  const gno = await TokenGNO.deployed()

  const getBalances = acc => Promise.all([
    eth.balanceOf(acc),
    gno.balanceOf(acc),
  ]).then(res => res.map(n => n.toNumber()))

  console.log(`${accountName}\t\tETH\tGNO`)

  let [accountETH, accountGNO] = await getBalances(account)
  console.log(`Balance was:\t${accountETH}\t${accountGNO}`)

  if (argv.eth) {
    try {
      await eth.transfer(account, argv.eth, { from: master })
    } catch (error) {
      console.error(error.message || error)
    }
  }

  if (argv.gno) {
    try {
      await gno.transfer(account, argv.gno, { from: master })
    } catch (error) {
      console.error(error.message || error)
    }
  }

  [accountETH, accountGNO] = await getBalances(account)
  console.log(`Balance is:\t${accountETH}\t${accountGNO}`)
}
