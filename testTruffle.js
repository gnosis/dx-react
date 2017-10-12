let acc1 = '0x7f7b4117e5728a26c28b095e34a580303f75c49f'
let acc2 = '0xfeed66f2a3917a977cc08c34ac3cc5e3000a1e8a'

let bal

Balance.deployed().then((inst) => {
  bal = inst
  return bal.getBalance(acc1)
}).then((resp) => {
  console.log(`Success! Balance for ${acc1} = ${resp}`)
}).catch((err) => {
  console.log(err)
})
