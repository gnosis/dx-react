const ipfsAPI = require('ipfs-api')
const fs = require('fs')

const filePath = process.argv[process.argv.length - 1]

const getContents = async () => {
  const postingFile = filePath === __filename
  if (postingFile) {
    const str = `some random number: ${Math.random() * 100}`
    const buffer = Buffer.from(str)

    return {
      length: buffer.length,
      content: buffer,
      path: str,
    }
  }


  const stream = fs.createReadStream(filePath)
  const length = await new Promise((res, rej) => fs.stat(filePath, (err, st) => (err ? rej(err) : res(st.size))))

  return {
    length,
    content: stream,
    path: filePath,
  }
}


async function run() {
  const { length, path, content } = await getContents()
  const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

  console.log(`POSTING "${path}" to IPFS`)

  const progress = len => console.log(`PROGRESS: ${len}/${length} ${len / length * 100} %`)

  try {
    // path that it gets by default from ReadableStream
    // as well as just ./filename
    // posts an empty folder
    // need to investigate
    const [result] = await ipfs.files.add({ content }, { progress })

    console.log('result: ', result)
    console.log(`\nhttps://gateway.ipfs.io/ipfs/${result.hash}\n\n`)
  } catch (error) {
    console.error('Error', error)
  }
}

run()
