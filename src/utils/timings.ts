import { AUCTION_RUN_TIME, WAITING_PERIOD, AuctionStatus as Status } from 'globals'
import { BigNumber } from 'types'

const getHhMm = (ms: number) => {
  const d = new Date(ms)
  return {
    h: d.getUTCHours(),
    m: d.getUTCMinutes(),
  }
}

const formatHours = ({ h, m }: {h:number, m:number}) => {
  let hours = h > 0 ? h.toString() : ''
  let minutes = ''
  let delim = ''

  if (m > 45) hours = (h + 1).toString()
  else if (m > 30) minutes = '45'
  else if (m > 15) minutes = '30'
  else if (m > 0) minutes = '15'

  if (hours && minutes) {
    delim = ':'
    hours += 'h'
    minutes += 'min'
  } else {
    if (hours) hours += ' hours'

  	 if (minutes) minutes += 'min'
  }

  return hours + delim + minutes
}

interface TimingApprox {
  auctionStart: BigNumber,
  now: number,
  status: Status,
}

export const getTimingApproximations = ({ auctionStart, status, now }: TimingApprox) => {
  if (status === Status.ENDED || status === Status.INACTIVE) return null

  now = now * 1000

  // auction is in 10 min waiting period
  if (auctionStart.eq(1)) {
    if (status === Status.INIT) { return {
      willStart: 'soon',
      runFor: 'approx. 6h',
      claim: 'in approx. 6h',
    }
    }
    // Produces in AuctionStatus(
    //   <p>
    //     The auction will start soon and run for approx. 6 hours
    //     <br/>
    //     <br/>
    //     {userParticipates && `You may claim your ${bToken} in approx. 6 hours`}
    //   </p>
    // )

    if (status === Status.PLANNED) { return {
      willStart: 'in approx 6h:45min',
      runFor: 'approx. 6h',
      claim: 'in approx. 12h:45min',
    }
    }
    // Produces in AuctionStatus(
    //   <p>
    //     The auction will start in approx 6h:45min and run for approx. 6 hours
    //     <br/>
    //     <br/>
    //     {userParticipates && `You may claim your ${bToken} in approx. 12h:45min`}
    //   </p>
    // )
  }

  const auctionStartMs = auctionStart.mul(1000)

  // auctionStart time is always in the past for Status.ACTIVE auctions
  // except for whenthe auction only starts and
  // auctionStart is set 10min in the future (WAITING_PERIOD)

  // index corresponds to an active auction
  if (status === Status.ACTIVE) {
    if (auctionStartMs.lt(now)) {
      const timeSinceStart = now - auctionStartMs.toNumber()
      const { h: hoursSinceStart } = getHhMm(timeSinceStart)

      if (hoursSinceStart > 6) {
        const willEnd = 'soon'
        return { willEnd, claim: willEnd }
      }
      // Produces in AuctionStatus(
      //   <p>This auction will end soon</p>
      // )

      const timeTillEnd = AUCTION_RUN_TIME - timeSinceStart
      const willEnd = `in approx ${formatHours(getHhMm(timeTillEnd))}`

      return { willEnd, claim: willEnd }
      // Produces in AuctionStatus(
      //   <p>This auction is running and will end in approx {formatHours(getHhMm(timeTillEnd))}</p>
      // )
    } else {
      const timeTillNext = auctionStartMs.toNumber() - now

      // auctionStart was just set to a waiting period
      // the auction started, but auctionStart is 10min in the future
      if (timeTillNext <= WAITING_PERIOD) {
        const willEnd = 'in approx 6h:30min'
        return { willEnd, claim: willEnd }
      }
      // Produces in AuctionStatus(
      //   <p>This auction is running and will end in approx 6h:30min</p>
      // )

      const hhMmTillNext = getHhMm(timeTillNext)

      if (hhMmTillNext.h <= 0) {
        const willEnd = 'soon'
        return { willEnd, claim: willEnd }
      }
      // Produces in AuctionStatus(
      //   <p>This auction will end soon</p>
      // )

      const willEnd = `in approx ${formatHours(hhMmTillNext)}`

      return { willEnd, claim: willEnd }
      // Produces in AuctionStatus(
      //   <p>This auction is running and will end in approx {formatHours(hhMmTillNext)}</p>
      // )
    }
  }

  // index corresponds to a future auction
  if (status === Status.PLANNED) {
    const timeSinceStart = now - auctionStartMs.toNumber()
    const timeTillNext = auctionStartMs.add(AUCTION_RUN_TIME + WAITING_PERIOD).sub(now).toNumber()
    const claimableIn = timeTillNext + AUCTION_RUN_TIME

    if (timeSinceStart >= AUCTION_RUN_TIME) {
      return { willStart: 'soon', runFor: 'approx. 6 hours', claim: 'in approx. 6h:30min' }
      // Produces in AuctionStatus(
      //   <p>
      //     The auction will start soon and run for approx. 6 hours
      // <br />
      //     {userParticipates && `You may claim your ${bToken} in approx. 6h:30min`}
      //   </p>
      // )
    }

    return {
      willStart: `in approx. ${formatHours(getHhMm(timeTillNext))}`,
      runFor: 'approx. 6 hours',
      claim: `in approx. ${formatHours(getHhMm(claimableIn))}`,
    }
    // Produces in AuctionStatus(
    //   <p>
    //     The auction will start in approx. {formatHours(getHhMm(timeTillNext))} and run for approx 6 hours
    //   <br />
    //     {userParticipates && `You may claim your ${bToken} in approx. ${formatHours(getHhMm(claimableIn))}`}
    //   </p>
    // )
  }

  return null

}
