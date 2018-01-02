async function assertRejects(q, msg) {
  let res, catchFlag = false
  try {
    res = await q
  } catch (e) {
    catchFlag = true
  } finally {
    if (!catchFlag) {
      assert.fail(res, null, msg)
    }
  }
}

const wait = seconds => web3.currentProvider.send({
  jsonrpc: '2.0',
  method: 'evm_increaseTime',
  params: [seconds] || [],
  id: new Date().getTime(),
})

const blockNumber = () => web3.eth.blockNumber

const timestamp = (block = 'latest') => web3.eth.getBlock(block).timestamp

module.exports = {
  assertRejects,
  timestamp,
  blockNumber,
  wait,
}
