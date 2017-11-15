export const delay = (timeout = 20000) => new Promise((res) => {
  console.log(`start delay ${timeout / 1000} sec`)

  setTimeout(() => (console.log('end delay'), res()), timeout)
})

export const metamaskWarning = (acc: string, addr: string) =>
  console.log(`If testing with METAMASK you need to be on the ${acc} (${addr}) account`)
