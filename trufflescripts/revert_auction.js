/*eslint-disable*/
const { revertSnapshot } = require('./utils')(web3)

module.exports = async () => {
  try {
    const reverted = revertSnapshot()
    console.log('REVERTING SNAPSHOT - NOW AT BLOCK-ID #', reverted)
  } catch(e) {
    console.log(`ERROR REVERTING: ${e}`)
  }
}
