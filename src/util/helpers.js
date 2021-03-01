import BigNumber from 'bignumber.js'
import Web3 from 'web3';
const web3 = new Web3()

export const truncateString = (addr, start=6, end=4) => addr ? `${addr.substring(0, start)}...${addr.substring(addr.length - end)}` : null
export const numberToMaxDb = (value, dp=2) => +parseFloat(value).toFixed( dp )
export const fromWei = (amount=0, unit='ether') => web3.utils.fromWei(amount.toString(), unit)
export const maxApproval = new BigNumber(2).pow(256).minus(1);