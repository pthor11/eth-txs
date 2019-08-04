import mongoose from '../mongoose'

const ShortTXSchema = new mongoose.Schema({
    hash: { type: String, required: true, unique: true},
    timestamp: { type: Number, required: true, index: true },
    blockNumber: { type: Number, required: true, index: true },
    from: { type: String, required: true, index: true },
    to: { type: String, required: true, index: true },
    value: { type: String, required: true },
    gasPrice: { type: Number, required: true },
    gasUsed: { type: Number, required: true },
    status: { type: String, required: true, index: true },
    coin: { type: String, required: true, index: true }
})

export default mongoose.wallet_txs_conn.model('TX', ShortTXSchema, 'etc')