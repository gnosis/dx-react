// npm run add2ipfs -- test/resources/token-pairs-ipfs-rinkeby.js

// RINKEBY

module.exports = {
  elements: [
    {
      symbol: 'ETH',
      name: 'Ether',
      address: '0x0',
      decimals: 18,
      isETH: true,
    },
    {
      symbol: 'WETH',
      name: 'Wrapped Ether',
      address: '0xc778417e063141139fce010982780140aa0cd5ab',
      decimals: 18,
    },
    {
      symbol: 'RDN',
      name: 'Raiden',
      address: '0x3615757011112560521536258c1e7325ae3b48ae',
      decimals: 18,
    },
  ],
  pagination: {
    endingBefore: null,
    startingAfter: null,
    limit: 20,
    order: [{ param: 'symbol', direction: 'ASC' }],
    previousUri: null,
    nextUri: null,
  },
}
