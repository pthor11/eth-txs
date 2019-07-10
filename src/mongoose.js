import mongoose from 'mongoose'
import {mongo} from '../config'

mongoose.Promise = global.Promise

const full_txs_uri = `mongodb://${mongo.user}:${mongo.password}@${mongo.url}:${mongo.port}/${mongo.db_full_txs}`
const short_txs_uri = `mongodb://${mongo.user}:${mongo.password}@${mongo.url}:${mongo.port}/${mongo.db_short_txs}`

const opts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}

mongoose.full_txs_conn = mongoose.createConnection(full_txs_uri, opts)
mongoose.short_txs_conn = mongoose.createConnection(short_txs_uri, opts)

export default mongoose