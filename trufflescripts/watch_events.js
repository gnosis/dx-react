const DutchExchangeETHGNO = artifacts.require('./DutchExchangeETHGNO.sol')
const TokenETH = artifacts.require('./TokenETH.sol')
const TokenGNO = artifacts.require('./TokenGNO.sol')

const argv = require('minimist')(process.argv.slice(2), { alias: { v: 'verbose' } })

/**
 * truffle exec trufflescripts/watch_events.js
 * subscribe and log events for TokenETH, TokenGNO and DutchExchangeETHGNO contracts
 * @flags:
 * --eth                                  watch all events for TokenETH contract
 * --eth Transfer,Approval                watch Transfer and Approval events for TokenETH contract
 * --gno
 * --gno <eventName1>,<eventName2>
 * --dx
 * --dx <eventName1>,<eventName2>
 * --log                                  don't watch, just print all past events
 * -v | --verbose                         also display blockNumber/transactionIndex/logIndex for each event
 */

module.exports = async () => {
  console.log(argv)
  // web3 is available in the global context
  const [master, seller, buyer] = web3.eth.accounts

  const eth = await TokenETH.deployed()
  const gno = await TokenGNO.deployed()
  const dx = await DutchExchangeETHGNO.deployed()

  const addr2acc = {
    [master]: 'Master',
    [seller]: 'Seller',
    [buyer]: 'Buyer',
    [dx.address]: 'DutchExchangeETHGNO',
    [eth.address]: 'ETH',
    [gno.address]: 'GNO',
  }

  const printTime = () => (!argv.log ? `${new Date().toLocaleTimeString()}\t` : '')

  // when logging, read from the very first block
  const filterObj = argv.log && { fromBlock: 0 }
  // and wait  for all events before printing them as they will be out of order
  const logPromises = argv.log && []

  const printLog = (name, err, log) => {
    if (err) {
      console.error(err)
      return
    }

    const {
      args,
      event,
      logIndex,
      transactionIndex,
      blockNumber,
    } = log

    const addrRegex = /^0x\w{40}$/
    for (const arg of Object.keys(args)) {
      const val = args[arg]

      if (val.toNumber) {
        // convert BigNumbers
        args[arg] = val.toNumber()
        // if address
      } else if (typeof val === 'string' && addrRegex.test(val)) {
        args[arg] = addr2acc[val] || val
      }
    }

    const verbose = argv.v ? `${blockNumber}/${transactionIndex}/${logIndex}\t` : ''

    console.log(`${printTime()}${verbose}${name}::${event}`, args)
  }

  const printLogs = (logs) => {
    // logs will be sorted by event type and then by time
    // need to manually sort by time
    logs.sort((a, b) => {
      // first sort by blockNumber
      let diff = a.blockNumber - b.blockNumber
      if (diff) return diff

      // if blockNumbers are the same,
      // sort by transactionIndex
      diff = a.transactionIndex - b.transactionIndex
      if (diff) return diff

      // finally by logIndex
      return a.logIndex - b.logIndex
    }).forEach(log => printLog(log.contractName, null, log))
  }

  const watch = (name, contract, events) => {
    const processEvent = (event) => {
      if (argv.log) {
        // if logging, then first wait to gather all events
        logPromises.push(new Promise((res, rej) => event.get((err, logs) => {
          if (err) {
            if (err.message === 'contract[e] is not a function') {
              console.warn(`contract ${name} doesn't have ${event} event`)
            } else return rej(err)
          }

          // additionally assign to each event its contract name
          return res(logs.map(log => Object.assign({ contractName: name }, log)))
        })))
      } else event.watch(printLog.bind(null, name))
    }

    const eventsArray = typeof events === 'string' ? events.split(',') : ['allEvents']

    eventsArray.forEach((e) => {
      try {
        processEvent(contract[e](filterObj))
      } catch (error) {
        if (error.message === 'contract[e] is not a function') {
          console.warn(`contract ${name} doesn't have ${e} event`)
        } else throw error
      }
    })
  }

  if (!argv.eth && !argv.gno && !argv.dx) {
    watch('ETH', eth)
    watch('GNO', gno)
    watch('DutchExchangeETHGNO', dx)
  } else {
    if (argv.eth) {
      watch('ETH', eth, argv.eth)
    }

    if (argv.gno) {
      watch('GNO', gno, argv.gno)
    }

    if (argv.dx) {
      watch('DutchExchangeETHGNO', dx, argv.dx)
    }
  }

  if (argv.log) {
    try {
      // [[eth events], [gno events], [dx events]]
      const arrOfarrOfEvents = await Promise.all(logPromises)
      // [...eth events,...gno events,...dx events]
      const arrOfEvents = [].concat(...arrOfarrOfEvents)
      printLogs(arrOfEvents)
    } catch (error) {
      console.error(error)
    }
  }
}
