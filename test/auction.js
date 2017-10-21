const Token = artifacts.require('./Token.sol');
const DutchExchange = artifacts.require('./DutchExchange.sol');
const DutchExchangeFactory = artifacts.require('./DutchExchangeFactory.sol');

contract('Auction', async (accounts) => {
  console.log(accounts);

  let initialiser;
  let seller;
  let buyer;

  let sellToken;
  let buyToken;
  let DUTCHX;
  let dx;

  let dxa;

  let dxFactory;

  beforeEach(async function () {
    initialiser = accounts[0];

    // get seller set up
    seller = accounts[1];
    sellToken = await Token.new();
    await sellToken.approve(seller, 100);
    await sellToken.transferFrom(initialiser, seller, 100, { from: seller });

    // get buyer set up
    buyer = accounts[2];
    buyToken = await Token.new();
    await buyToken.approve(buyer, 1000);
    await buyToken.transferFrom(initialiser, buyer, 1000, { from: buyer });

    DUTCHX = await Token.new();

    // create dx
    dx = await DutchExchange.new(2, 1, sellToken.address, buyToken.address, DUTCHX.address);
    dxa = dx.address;

    dxFactory = await DutchExchangeFactory.new(DUTCHX.address)
  })



  it('works', async () => {
    // what tokenPairSelect does

    const amount = 30
    const proposedVal = 2


    const res = await dXFactory.proposeExchange(sellToken.address, buyToken.address, amount, proposedVal)
    // ReferenceError: dXFactory is not defined, as if I didn't require the artifact

    assert.true(res)
  })
})
