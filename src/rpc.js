import axios from 'axios'
import {parity} from '../config'

const call = (method, params) => {
    const data = JSON.stringify({
        method,
        params,
        jsonrpc: '2.0',
        id: 1
    })

    return axios({
        url: parity.url,
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export default call