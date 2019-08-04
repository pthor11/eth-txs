import Web3 from 'web3'
import {etc} from './config'
let web3 = new Web3(new Web3.providers.HttpProvider(`http://${etc.username}:${etc.password}@${etc.url}:${etc.port}`))

export default web3

