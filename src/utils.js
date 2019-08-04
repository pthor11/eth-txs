import web3 from './web3'

const checkCode = async (address) => {
    try {
        const code = await web3.eth.getCode(address)
        return code === '0x' ? 'etc' : address
    } catch (err) {
        console.log(err)          
        return null
    }
}

export  {
    checkCode
}