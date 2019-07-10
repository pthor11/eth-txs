import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 4000

const mongo = {
    user: process.env.MONGO_USER || 'txs',
    password: process.env.MONGO_PASSWORD || 'txs123',
    url: process.env.MONGO_URL || '192.168.1.250',
    port: process.env.MONGO_URL || '27017',
    db_full_txs: process.env.MONGO_DB_FULL_TXS || 'full-txs?authSource=txs',
    db_short_txs: process.env.MONGO_DB_SHORT_TXS || 'short-txs?authSource=txs'
}

const parity = {
    url: process.env.WEB3_URL || 'http://192.168.1.250:8545'
}

export  {
    mongo,
    parity
}