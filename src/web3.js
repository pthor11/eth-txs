import Web3 from 'web3'
import {eth} from './config'
let web3 = new Web3(new Web3.providers.HttpProvider(eth.url))

export default web3

