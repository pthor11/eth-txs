import web3 from './web3'
import FullTX from './models/TX.full'
import ShortTX from './models/TX.short'
import Checkpoint from './models/Checkpoint'
import { checkCode } from './utils'

let checkpoint = null

const run = async () => {
    try {
        checkpoint = checkpoint || (await Checkpoint.findOne({ mission: 'eth-fulltx' }) || new Checkpoint({ mission: 'eth-fulltx', at: 0 }))

        const blockNumber = checkpoint.at === 0 ? 0 : checkpoint.at + 1

        const block = await web3.eth.getBlock(blockNumber)

        if (!block) {
            console.log(`eth-full-txs is up to date`)
            setTimeout(start, 1000)
            return false
        }

        const hashes = block.transactions

        const [transactions, receipts] = await Promise.all([
            Promise.all(hashes.map(hash => web3.eth.getTransaction(hash))),
            Promise.all(hashes.map(hash =>  web3.eth.getTransactionReceipt(hash)))

        ])


        if (!((hashes.length === transactions.length) && (hashes.length === receipts.length))) {
            throw new Error({
                message: 'Length of transactions & receipts do not match',
                blockNumber
            })
        }

        let fullTXs = []
        let shortTXs = []

        for (let i = 0; i < hashes.length; i++) {
            const hash = hashes[i]
            const transaction = transactions[i]
            const receipt = receipts[i]
            const timestamp = block.timestamp

            if (transaction.from && transaction.to) {
                const codes = await Promise.all([
                    checkCode(transaction.from),
                    checkCode(transaction.to)
                ])

                if (codes.includes('eth')) {
                    const fullTX = new FullTX({
                        hash,
                        timestamp,
                        transaction,
                        receipt,
                    })

                    const shortTX = new ShortTX({
                        hash,
                        timestamp,
                        from: transaction.from,
                        to: transaction.to,
                        value: transaction.value,
                        fee: transaction.gasPrice * receipt.gasUsed,
                        status: receipt.status,
                        coin: codes.find(code => code !== 'eth') || 'eth'
                    })

                    fullTXs.push(fullTX)
                    shortTXs.push(shortTX)
                }
            }
        }
    
        await Promise.all([
            FullTX.insertMany(fullTXs),
            ShortTX.insertMany(shortTXs)
        ])

        checkpoint.at += 1
        await checkpoint.save()

        run()

    } catch (error) {
        console.log(error);
        
        throw new Error({
            error: error.response
        })
    }

}

const rollback = async () => {
    checkpoint = await Checkpoint.findOne({ mission: 'eth-fulltx' })
    if (!checkpoint) {
        return false
    }
    const fulltx_hashes = await FullTX.find({"transaction.blockNumber": {$gt: checkpoint.at}}, {_id: 0, hash: 1})
    const hashes = fulltx_hashes.map(fulltx => fulltx.hash)
        
    await FullTX.deleteMany({hash: {$in: hashes}})
    await ShortTX.deleteMany({hash: {$in: hashes}})
}

const start = async () => {
    await rollback()
    await run()
}

start()