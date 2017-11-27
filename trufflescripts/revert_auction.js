/*eslint-disable*/
const { revertSnapshot } = require('./utils')(web3)

module.exports = async () => {
  try {
    const reverted = await revertSnapshot()
    console.log('REVERTING SNAPSHOT - NOW AT BLOCK #', reverted)
  } catch(e) {
    console.log(`ERROR REVERTING: ${e}`)
  }
}
