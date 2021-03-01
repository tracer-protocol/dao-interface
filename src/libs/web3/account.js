import { useEffect, useState, createContext, useContext } from 'react'
import { debounce } from 'lodash'
import { useStatus, useWeb3 } from './util'
import Network from './network'

const Context = createContext({});

const StatusOptions = [
	'DISCONNECTED',
	'CONNECTING',
	'CONNECTED',
	'LOCKED',
	'ERROR'
]

const useAccount = () => useContext(Context)

const Provider = ({children}) => {	
	const [address, setAddress] = useState()
	const [balance, setBalance] = useState()
	const [status, setStatus] = useStatus(StatusOptions, StatusOptions[0])
	const [message, setMessage] = useState()
	const [blockWatcher, setBlockWatcher] = useState()
	const { web3, status: web3Status } = useWeb3()
	const { id, status: networkStatus } = Network.useNetwork()

	const connect = () => setStatus('CONNECTING')

	const disconnect = msg => {
		setStatus('DISCONNECTED')
		setMessage(msg)
	}

	const handleConnection = () => new Promise(async (resolve, reject) => {
		if(web3Status === 'AVAILABLE'){
			if(networkStatus === 'ENABLED'){
				const accounts = await web3.eth.getAccounts()

				if(accounts[0]){
					setAddress(accounts[0])
					resolve()
				}else{
					await web3.givenProvider.request({ method: 'eth_requestAccounts' });
					const _accounts = await web3.eth.getAccounts()
					setAddress(_accounts[0])
					resolve()
				}
			}else{
				disconnect(`Network not configured`)
				reject()
			}
		}else{
			disconnect(`Metamask ${web3Status}`)
			reject()
		}
	})

	const fetchBalance = async () => {
		const bal = await web3.eth.getBalance(address)
		setBalance(bal)
	}

	useEffect(() => {
		switch (status) {
			case 'DISCONNECTED':
				setAddress(null)
				setBalance()
				break;
			case 'CONNECTING':
				handleConnection()
					.then(() => setStatus('CONNECTED'))
					.catch(() => {})
				break;
			case 'CONNECTED':
				fetchBalance()

				blockWatcher && blockWatcher.unsubscribe()
				const sub = web3.eth.subscribe('newBlockHeaders').on("data", debounce(fetchBalance, 500))
				setBlockWatcher(sub)
				break;
			case 'ERROR':
			default:
				setStatus('DISCONNECTED')
				break;
		}
	}, [status]) // eslint-disable-line
	

	// on network ID change
	useEffect(() => {
		if(id && networkStatus === 'ENABLED' && status === 'CONNECTED'){
			connect()
		}else{
			disconnect(networkStatus !== 'ENABLED' && `Network not configured`)
		}
	}, [id, networkStatus]) // eslint-disable-line

	// once we have web3, watch for events
	useEffect(() => {
		if(web3?.version){
			web3.givenProvider.on('accountsChanged', connect)
		}
	}, [web3?.version, status]) // eslint-disable-line

	return <Context.Provider 
		value={{
			address,
			balance,
			status,
			message,
			connect,
			disconnect
		}}
		>
		{children}
	</Context.Provider>
}

export default {
	Provider,
	useAccount
}