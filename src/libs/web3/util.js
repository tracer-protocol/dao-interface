import { useEffect, useState } from 'react'
import Web3 from 'web3'

export const useStatus = (opts=[], initialVal) => {

	const [status, setStatus] = useState(initialVal||opts[0])

	return [
		status,
		val => {
			if(typeof val !== 'string'){
				console.warn(`Status must be a string`)
			}
			else if(opts.includes(val)){
				setStatus(val)
			}
			else{
				console.warn(`Cannot set status to ${val}`)
			}
		}
	]
}

export const useWeb3 = () => {

	const statusOptions = [
		'INITIALIZED',
		'LOCKED',
		'AVAILABLE',
		'UNAVAILABLE',
	]

	const [web3, setWeb3] = useState()
	const [status, setStatus] = useStatus(statusOptions, statusOptions[0])

	useEffect(() => getProvider(), []) // eslint-disable-line

	const getProvider = async () => {
		// check provider
		const provider = Web3.givenProvider
		provider.autoRefreshOnNetworkChange = false
		if(!provider){
			setStatus('UNAVAILABLE')
			setWeb3(null)
			return
		}

		const web3 = new Web3(provider);
		if(!web3){
			setStatus('UNAVAILABLE')
			setWeb3(null)
			return
		}

		setStatus('AVAILABLE')
		setWeb3(web3)
	}

	

	return {
		status,
		web3
	}
}