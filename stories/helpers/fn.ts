import { codeList } from 'globals'
import { TokenBalances, RatioPairs, TokenPair } from 'types'

export const getRandomInt = (min: number, max: number): number => {
  const mn = Math.ceil(min)
  const mx = Math.floor(max)
  return Math.floor(Math.random() * (mx - mn)) + mn
}

// Create Fn that returns Array of length(x) w/Auction props (a,b,c,d,e)
export const walletObjectFactory = (amt: number, arr: string[]) => {
  const tokensWallet = {}

  for (let i = 0; i <= amt; i = i + 1) {
    const name: string = arr[getRandomInt(0, arr.length)]

    if (!tokensWallet[name]) {
      tokensWallet[name] = {
        name,
        balance: 100 * Math.random(),
      }
    } else {
      continue
    }
  }
  return tokensWallet
}

// Create Fn that returns Array of length(x) w/Auction props (a,b,c,d,e)
export const auctionFactory = (amt: number, arr: string[]) => {
  const auctionsToShow = []

  for (let i = 0; i <= amt; i = i + 1) {
    auctionsToShow.push({
      id: +(Math.random() * 5).toFixed(3).toString(),
      sellToken: arr[getRandomInt(0, arr.length)],
      buyToken: arr[getRandomInt(0, arr.length)],
      buyPrice: +(Math.random() * 5).toFixed(4),
      claim: getRandomInt(0, 4) < 2 ? false : true,
    })
  }
  return auctionsToShow
}

/**
 * generates tokenBalances = {
 *  'ETH': '0.3434321',
 *  ...
 * } for each token from codeList
 * @param codes 
 */
export const generateTokenBalances = (codes = codeList) => codes.reduce(
  (acc, code) => (acc[code] = (Math.random() * 5).toFixed(9), acc), {},
) as TokenBalances

/*
* generates ratioPairs = {
*  { buy: 'GNO' sell: 'ETH', price: 0.31214312 },
   { buy: 'OMG', sell: 'ETH', price: 0.01976562 },
*  ...
* } from codeList
*/
export const generateRatioPairs = (codes = codeList) => codes.reduce((acc, code) => {
  if (code !== 'ETH') acc.push({
    sell: 'ETH',
    buy: code,
    price: Math.random().toFixed(8),
  })

  return acc
}, []) as RatioPairs

const samplePair = (list: any[]): [any, any] => {
  const copy = list.slice()
  const getRandomInd = () => Math.floor(Math.random() * copy.length)

  const [one] = copy.splice(getRandomInd(), 1)
  const two = copy[getRandomInd()]

  return [one, two]
}

/**
 * 
 * @param codes generates tokenPair = {
 *  sell: 'ETH'
 *  buy: 'GNO'
 * } by taking random TokenCode pair from codeList
 */
export const generateTokenPair = (codes = codeList): TokenPair => {
  const [sell, buy] = samplePair(codes)
  return { sell, buy }
}
