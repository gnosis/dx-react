const DutchExchangeETHGNO = artifacts.require('./DutchExchangeETHGNO.sol')
const { getTime } = require('./utils')(web3)

const getTimeStr = (timestamp) => {
  const date = new Date(Math.abs(timestamp))
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = date.getUTCSeconds()

  return `${hh ? `${hh} hour(s) ` : ''}${mm ? `${mm} minute(s) ` : ''}${ss ? `${ss} second(s) ` : ''}`
}

/**
 * truffle exec trufflescripts/get_auction_stats.js
 * prints stats for the current and past auctions
 */

module.exports = async () => {
  const dx = await DutchExchangeETHGNO.deployed()
  const auctionStart = (await dx.auctionStart()).toNumber()
  const now = getTime()

  const timeUntilStart = auctionStart - now
  const timeStr = getTimeStr(timeUntilStart * 1000)

  const auctionIndex = (await dx.auctionIndex()).toNumber()

  const [, seller, buyer] = web3.eth.accounts

  const sellVolumeCurrent = (await dx.sellVolumeCurrent()).toNumber()
  const sellVolumeNext = (await dx.sellVolumeNext()).toNumber()
  const sellerBalanceNext = sellVolumeNext && (await dx.sellerBalances(auctionIndex + 1, seller)).toNumber()

  console.log(`
Current auction index ${auctionIndex}
  ______________________________________
  now:\t\t\t${new Date(now * 1000).toTimeString()}
  auctionStart:\t\t${new Date(auctionStart * 1000).toTimeString()}
  ${timeUntilStart > 0 ? `starts in\t\t${timeStr}` : timeUntilStart < 0 ? `started\t\t${timeStr}ago` : 'just started'}
  
  sellVolumeCurrent:\t${sellVolumeCurrent}
  sellVolumeNext:\t${sellVolumeNext}${sellerBalanceNext ? `\n  sellerBalance for next auction:\t${sellerBalanceNext}` : ''}  
  `)


  // if auctionIndex === 3, indexes = [3, 2, 1]
  const indexes = Array.from({ length: auctionIndex }, (v, i) => auctionIndex - i)

  const readStats = async (i) => {
    const buyVolume = (await dx.buyVolumes(i)).toNumber()

    let price, amountToClearAuction, timeUntilAuctionClears
    try {
      const [num, den] = (await dx.getPrice(i)).map(n => n.toNumber())
      price = `1 ETH = ${(num / den).toFixed(8)} GNO`

      // if current running auction
      if (i === auctionIndex) {
        /* eslint-disable no-mixed-operators */
        amountToClearAuction = Math.floor(sellVolumeCurrent * num / den) - buyVolume
        const timeWhenAuctionClears = Math.ceil(72000 * sellVolumeCurrent / buyVolume - 18000 + auctionStart)

        timeUntilAuctionClears = getTimeStr((now - timeWhenAuctionClears) * 1000)
      }
    } catch (error) {
      price = 'unavailable, auction hasn\'t started'

      const [num, den] = (await dx.getPrice(i - 1)).map(n => n.toNumber())
      price += `\n  last closingPrice:\t1 ETH = ${(num / den).toFixed(8)} GNO`
    }

    const sellerBalance = (await dx.sellerBalances(i, seller)).toNumber()
    const buyerBalance = (await dx.buyerBalances(i, buyer)).toNumber()
    const sellerClaimed = (await dx.claimedAmounts(i, seller)).toNumber()
    const buyerClaimed = (await dx.claimedAmounts(i, buyer)).toNumber()

    if (i !== auctionIndex) {
      console.log('=============================')
      console.log(`Auction index ${i}`)
    }

    console.log(`
  buyVolume:\t\t${buyVolume}
  price:\t\t${price}${amountToClearAuction ? `\n  to clear auction buy\t${amountToClearAuction} GNO` : ''}
  ${timeUntilAuctionClears ? `will clear with time in ${timeUntilAuctionClears}` : ''}

  sellerBalance:  ${sellerBalance}\tclaimed:  ${sellerClaimed} ETH
  buyerBalance:   ${buyerBalance}\tclaimed:  ${buyerClaimed} GNO
    `)
  }

  for (const i of indexes) {
    await readStats(i)
  }
}
