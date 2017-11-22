const TokenETH = artifacts.require('./TokenETH.sol')
const TokenGNO = artifacts.require('./TokenGNO.sol')

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
}
