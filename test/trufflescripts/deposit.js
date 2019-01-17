/* eslint no-console:0 */
const { getTokenDeposits, depositToDX } = require('./utils/contracts')(artifacts)
const { mineCurrentBlock } = require('./utils')

const argv = require('minimist')(process.argv.slice(2), { string: 'a' })

/**
 * truffle exec test/trufflescripts/deposit.js
 * to deposit funds to DutchExchange contracts
 * @flags:
 * --master                     as the master
 * --seller                     as the seller
 * --buyer                      as the buyer
 * -a <address>                 as the given address
 * --eth <number>               ETH tokens
 * --gno <number>               GNO tokens
 */

module.exports = async () => {
  if (!(argv.eth || argv.gno || argv.omg || argv.rdn) || !(argv.master || argv.seller || argv.buyer || argv.a)) {
    console.warn('No tokens or accounts specified')
    return
  }

  let account, accountName
  if (argv.a) account = accountName = argv.a
  else if (argv.master) {
    [account] = web3.eth.accounts
    accountName = 'Master'
  } else if (argv.seller) {
    [, account] = web3.eth.accounts
    accountName = 'Seller'
  } else {
    [, , account] = web3.eth.accounts
    accountName = 'Buyer'
  }

  console.log(`${accountName}`)

  let { ETH, GNO, OMG, RDN } = await getTokenDeposits(account)
  console.log(`Deposit was:\tETH: \t${ETH},\tGNO: \t${GNO},\tOMG: \t${OMG},\tRDN: \t${RDN}`)

  const tokensToDeposit = { ETH: argv.eth, GNO: argv.gno, FRT: argv.frt, OWL: argv.owl, OMG: argv.omg, RDN: argv.rdn }

  await depositToDX(account, tokensToDeposit);

  ({ ETH, GNO, OMG, RDN } = await getTokenDeposits(account))
  console.log(`Deposit is:\tETH: \t${ETH},\tGNO: \t${GNO},\tOMG: \t${OMG},\tRDN: \t${RDN}`)
}
