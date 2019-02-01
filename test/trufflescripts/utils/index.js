/* eslint no-console:0 */

module.exports = (web3) => {
  const mergeAPI = async (argv) => {
    let account, accountName, accounts, master, seller, buyer, toBN, toWei
    if (typeof web3.version === 'string') {
      console.log('Using Web3 API 1.X.xx')

      accounts = await web3.eth.getAccounts();
      ([master, seller, buyer] = accounts);
      ({ toBN } = web3.utils)
      toWei = n => web3.utils.toWei(toBN(n))
    } else {
      console.log('Using Web3 API 0.X.xx');

      ({ accounts } = web3.eth);
      ([master, seller, buyer] = accounts)
      toBN = web3.toBigNumber;
      ({ toWei } = web3)
    }

    console.log('Accounts: ', master, seller, buyer)

    if (argv.a) account = accountName = argv.a
    else if (argv.seller) {
      account = seller
      accountName = 'Seller'
    } else if (argv.buyer) {
      account = buyer
      accountName = 'Buyer'
    } else {
      account = master
      accountName = 'Master'
    }

    return { account, accountName, accounts, master, seller, buyer, toBN, toWei }
  }

  const getTime = (blockNumber = 'latest') => web3.eth.getBlock(blockNumber).timestamp
  const getTimeNew = async (blockNumber = 'latest') => (await web3.eth.getBlock(blockNumber)).timestamp

  const mineCurrentBlock = () => web3.currentProvider.send({
    jsonrpc: '2.0',
    method: 'evm_mine',
    params: [],
    id: 0,
  }, (err, res) => (!err ? console.log('Block successfully mined! ', res) : console.error('Block mining error! ', err)))

  const increaseTimeBy = (seconds, dontMine) => {
    if (seconds < 0) {
      throw new Error('Can\'t decrease time in testrpc')
    }

    if (seconds === 0) return

    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [seconds],
      id: 0,
    }, (err, res) => (!err ? console.log('Block successfully mined! ', res) : console.error('Block mining error! ', err)))

    if (!dontMine) {
      mineCurrentBlock()
    }
  }

  const setTime = (seconds, dontMine) => {
    const increaseBy = seconds - getTime()

    increaseTimeBy(increaseBy, dontMine)
  }

  const makeSnapshot = () => web3.currentProvider.send({ jsonrpc: '2.0', method: 'evm_snapshot' }).result

  const revertSnapshot = snapshotID => new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({ jsonrpc: '2.0', method: 'evm_revert', params: [snapshotID] }, (err) => {
      if (!err) {
        console.log('Revert Success')
        resolve(snapshotID)
      } else {
        reject(err)
      }
    })
  })

  return {
    mergeAPI,
    getTime,
    getTimeNew,
    increaseTimeBy,
    setTime,
    makeSnapshot,
    revertSnapshot,
    mineCurrentBlock,
  }
}
