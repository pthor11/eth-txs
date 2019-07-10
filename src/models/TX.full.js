import mongoose from '../mongoose'

const TXSchema = new mongoose.Schema({
    hash: { type: String, unique: true, index: true, required: true},
    timestamp: { type: Number, default: 0},
    scanned: { type: Number, default: 0, index: true},
    transaction: {type: mongoose.Schema.Types.Mixed, default: null},
    receipt: {type: mongoose.Schema.Types.Mixed, default: null},
    
})

export default mongoose.full_txs_conn.model('TX', TXSchema, 'eth', true)