import { useEffect, useState, createContext, useContext, useReducer } from 'react'
import ipfsCore from 'ipfs-core'
import { useNetwork, useAccount } from '@libs/web3'

// TODO - add a network ID so you can properly create proposals on testnet
// dao-map will block any proposal creation on testnet since it validates the proposal
// based on the contract address

const Context = createContext({});

const useFileStorage = () => useContext(Context)

function fileReducer(state, action) {
	switch (action.type) {
		case 'add':
			state[action.id] = action.data
			return {...state}
		default:
			throw new Error();
	}
}

const Provider = 
	({
		url,
		children
	}) => {

		let { web3 } = useNetwork();
		let { address } = useAccount();

		const [IPFS, setIPFS] = useState()
		const [files, dispatch] = useReducer(fileReducer, {});
		const [loading, setLoading] = useState(true);
 		const init = async () => {
			try { // avoid re-init crash
				const ipfs = await ipfsCore.create()
				setIPFS(ipfs)
			} catch (error) {
				console.error(error, "Failed to init IPFS")
				setLoading(false)
			}
 		}

 		// hydrate all proposal data
 		const hydrate = async () => {
 			if(!IPFS) return

 			// fetch all proposals
 			fetch(`${url}/proposals`)
 				.then(result => result.json())
 				.then(items => {
 					// itterate items and fetch the IPFS data
 					Promise.all(items.forEach(async proposal => {
						const stream = await IPFS.cat(proposal.contenthash)
						let data = ''
						for await (const chunk of stream) {
							data += chunk.toString()
						}
						try {
							dispatch({type: 'add', id: proposal.id, data: JSON.parse(data)})
						} catch(error) {
							console.error("Failed to parse IPFS data", error)
						}
 					})).then((_res) => {
						setLoading(false)
					}).catch((error) => {
						console.error("Failed to parse IPFS data", error)
					})
 				})
				.catch((error) => {
					console.error("Failed to tetch ipfs data", error)
					setLoading(false)
				})
 		}
  		
 		// add items into ipfs
 		// push result to endpoint
 		let upload = (proposalId, proposalFields) => new Promise(async (resolve, reject) => {
 			if(!IPFS) {
 				reject('IPFS not available')
 				return
 			}

 			const { path } = await IPFS.add(JSON.stringify(proposalFields))

			console.debug("Uploaded content to ipfs", path)

 			const sig = await web3.eth.personal.sign(`${proposalId},${path}`, address)

 			const signature = {
				"address": address,
				"msg": `${proposalId},${path}`,
				"sig": sig
			}

 			fetch(`${url}/proposals`, 
 				{
	 				method: 'POST',
	 				headers: {
						'Content-Type': 'application/json'
					},
	 				body: JSON.stringify(signature),
	 			})
	 			.then(response => response.json())
	 			.then(data => {
					console.debug('Success:', data);
					resolve(path)
	 			})
 		})
  
 		useEffect(() => init(), [])
 		useEffect(() => hydrate(), [IPFS]) // eslint-disable-line

		return <Context.Provider 
			value={{
				files,
				hydrate,
				upload,
				loading
			}}
			>
			{children}
		</Context.Provider>
	};

export default {
	Provider,
	useFileStorage
}