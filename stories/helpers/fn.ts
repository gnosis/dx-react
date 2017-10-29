export const getRandomInt = (min: number, max: number): number => {
  const mn = Math.ceil(min)
  const mx = Math.floor(max)
  return Math.floor(Math.random() * (mx - mn)) + mn
}

// Create Fn that returns Array of length(x) w/Auction props (a,b,c,d,e)
export const walletObjectFactory = (amt: number, arr: string[]) => {
  const tokensWallet = {}
  
  for (let i = 0; i <= amt; i = i + 1) {
    const name: string = arr[getRandomInt(0,arr.length)]
    
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
      claim: getRandomInt(0,4) < 2 ? false : true,
    })
  }
  return auctionsToShow
}
