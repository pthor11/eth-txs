import web3 from './web3'
import TX from './models/TX'
import { checkCode } from './utils'


const run = async (blockNumber) => {
    try {
        
        const block = await web3.eth.getBlock(blockNumber)
        
        if (!block) {
            console.log(`etc-txs is up to date`)
            setTimeout(start, 1000)
            return Promise.resolve(true)
        }

        const hashes = block.transactions

        const [transactions, receipts] = await Promise.all([
            Promise.all(hashes.map(hash => web3.eth.getTransaction(hash))),
            Promise.all(hashes.map(hash => web3.eth.getTransactionReceipt(hash)))
        ])

        if (!((hashes.length === transactions.length) && (hashes.length === receipts.length))) {
            throw new Error({
                message: 'Length of transactions & receipts do not match',
                blockNumber
            })
        }

        let txs = []

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

                if (codes.includes('etc')) {

                    const tx = {
                        hash,
                        timestamp,
                        blockNumber,
                        from: transaction.from,
                        to: transaction.to,
                        value: transaction.value,
                        gasPrice: transaction.gasPrice,
                        gasUsed: receipt.gasUsed,
                        status: receipt.status,
                        coin: codes.find(code => code !== 'etc') || 'etc'
                    }
            
                    txs.push(tx)
                }
            }
        }

        try {
            await Promise.all(txs.map(tx => TX.findOneAndUpdate({ hash: tx.hash }, tx, { upsert: true, setDefaultsOnInsert: true })))
            console.log(`blockNumber: ${blockNumber} txs: ${txs.length}`)
            
            run(blockNumber + 1)
        } catch (error) {
            console.log(error)
            start()
        }
    } catch (error) {
        console.log(error);
        start()
    }

}

const rollback = async () => {
    const lastTX = await TX.findOne({}, { _id: 0, blockNumber: 1 }).sort({ blockNumber: -1 })
    if (lastTX) {
        await TX.deleteMany({ blockNumber : lastTX.blockNumber})
        return Promise.resolve(blockNumber)
    } else {
        return Promise.resolve(0)
    }
}

const start = async () => {    
    try {
        const blockNumber = await rollback()
        await run(blockNumber)
    } catch (error) {
        console.log(error)
        start()
    }
}

start()