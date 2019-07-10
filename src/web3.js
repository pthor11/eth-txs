import Web3 from 'web3'
import {parity} from '../config'
let web3 = new Web3(`http://${parity.url}:${parity.port}`)

export default web3

