const TokenETH = artifacts.require('./TokenETH.sol')
const TokenGNO = artifacts.require('./TokenGNO.sol')

const argv = require('minimist')(process.argv.slice(2), { string: 'a' })

/**
 * truffle exec trufflescripts/get_account_balances.js
 * get ETH and GNO balances for seller and buyer accounts
 * @flags:
 * -a <address>       and for the given account
 */

module.exports = async () => {
  // web3 is available in the global context
  const [, seller, buyer] = web3.eth.accounts

  const eth = await TokenETH.deployed()
  const gno = await TokenGNO.deployed()

  const sellerETHBalance = (await eth.balanceOf(seller)).toNumber()
  const sellerGNOBalance = (await gno.balanceOf(seller)).toNumber()
  const buyerETHBalance = (await eth.balanceOf(buyer)).toNumber()
  const buyerGNOBalance = (await gno.balanceOf(buyer)).toNumber()


  console.log(`Seller:\t${sellerETHBalance}\tETH,\t${sellerGNOBalance}\tGNO`)
  console.log(`Buyer:\t${buyerETHBalance}\tETH,\t${buyerGNOBalance}\tGNO`)

  if (argv.a) {
    const accountETHBalance = (await eth.balanceOf(argv.a)).toNumber()
    const accountGNOBalance = (await gno.balanceOf(argv.a)).toNumber()

    console.log(`\nAccount at ${argv.a} address`)
    console.log(`Balance:\t${accountETHBalance}\tETH,\t${accountGNOBalance}\tGNO`)
  }
}
