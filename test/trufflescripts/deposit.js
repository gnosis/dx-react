/* eslint-disable indent */
/* eslint no-console:0 */
const { getTokenDeposits, depositToDX, toBN } = require('./utils/contracts')(artifacts, web3)
const { mineCurrentBlock, mergeAPI } = require('./utils')(web3)

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
  try {
    const { account, accountName } = await mergeAPI(argv)

    console.log(`${accountName}`)

    let { ETH, GNO, OMG, RDN } = await getTokenDeposits(account)
    console.log(`Deposit was:\tETH: \t${ETH},\tGNO: \t${GNO},\tOMG: \t${OMG},\tRDN: \t${RDN}`)

    const TDP = { ETH: argv.eth, GNO: argv.gno, FRT: argv.frt, OWL: argv.owl, OMG: argv.omg, RDN: argv.rdn }

    const tokensToDeposit = Object.keys(TDP).reduce((acc, key) => {
      if (!TDP[key]) return acc

      acc[key] = toBN(TDP[key]).mul(toBN(10).pow(toBN(18)))
      return acc
    }, {})

    await depositToDX(account, tokensToDeposit)

    await mineCurrentBlock();

    ({ ETH, GNO, OMG, RDN } = await getTokenDeposits(account))
    console.log(`Deposit is:\tETH: \t${ETH},\tGNO: \t${GNO},\tOMG: \t${OMG},\tRDN: \t${RDN}`)
  } catch (error) {
    console.error('TCL: }catch -> error', error)
  } finally {
    process.exit()
  }
}
