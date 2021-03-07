import { useEffect, useState, createContext, useContext } from 'react'
import { find, filter } from 'lodash'
import moment from 'moment'
import { useQuery, gql } from '@libs/graph';
import { useFileStorage, useDao } from './' 

const Context = createContext({});

const ALL_PROPOSALS = gql`
	query Proposals {
		proposals {
			id
			votes {
				id
			}
			warmup
			status
			creator
			votesFor
			duration
			timestamp
			threshold
			totalStaked
			coolingOff
			lockDuration
			votesAgainst
		}
	}
`

const proposalStates = {
	UNDEFINED: 'undefined',
	PROPOSED: 'proposed',
	OPEN: 'open',
	PROCESSING: 'processing',
	COMPLETE: 'complete',
}


/*
	hook to fetch all proposals
	@return {bool}		loading 	flag indicating loading status
	@return {array}		proposals 	array of proposals
	..... TODO
*/
const useProposals = initialFilters => {
	const { proposals, loading, error, refetch } = useContext(Context)
	const [filtered, setFiltered] = useState([])

	const [ 
		filters, 
		setFilter 
	] = useState(initialFilters)

	useEffect(() => {
		const filtered_by_type = filter(proposals, filters, [])
		setFiltered(filtered_by_type)
	}, [proposals, filters])

	return {
		loading,
		proposals: filtered,
		error,
		filters,
		setFilter: (name, value) => setFilter(state => {
			state[name] = value
			return {...state}
		}),
		refetch
	}
}


/*
	hook to fetch proposal by ID

	@param {int} 	id 			id of the proposal to fetch
	@return {obj}	proposal 	proposal object
*/
const useProposal = id => {
	const { proposals } = useContext(Context)
	const [proposal, setProposal] = useState({})
	
	useEffect(() => {
		const proposal = find(proposals, {id: id})
		proposal && setProposal(proposal)
	}, [proposals, id])

	return {
		...proposal
	}
}

// timestamp: | timestamp of proposal creation | eg: 1610584962
// warmup | time before voting can start in seconds | eg: 7200
// duration | proposal duration in seconds | eg: 10800
// coolingOff | cooling off period in seconds | eg: 7200
const calculateProposalState = ({timestamp, warmup, duration, coolingOff}) => {
	if(!timestamp || !warmup || !duration || !coolingOff) return proposalStates.UNDEFINED

	let state = proposalStates.UNDEFINED
	const now = moment()
	const createdTime = moment.unix(timestamp)
	const openTime = moment(createdTime).add(warmup, 'seconds')
	const closeTime = moment(openTime).add(duration, 'seconds')
	const completeTime = moment(closeTime).add(coolingOff, 'seconds')

	if(now.isBefore(openTime)) state = proposalStates.PROPOSED
	else if(now.isBefore(closeTime)) state = proposalStates.OPEN
	else if(now.isBefore(completeTime)) state = proposalStates.PROCESSING
	else state = proposalStates.COMPLETE

	return {
		state: state,
		timestamps: {
			created: createdTime.unix(),
			open: openTime.unix(),
			closed: closeTime.unix(),
			complete: completeTime.unix()
		}
	}
}

/*
	proposal provider

	fetch all proposals, all IPFS IDs (from endpoint), and then IPFS data

	// proposal object shape
	// ---->
	// warmup: "7200" // time before voting can start
	// duration: "10800" // proposal duration in days
	// coolingOff: "7200" // cooling off period in hours
	// lockDuration: "14400" // time tokens are not withdrawable after voting or proposing
	// creator: "0x9c68ca6127efc3a2c80c5936521a725d9786f781"
	// id: "0"
	// threshold: "1000000000000000000"
	// timestamp: "1610584962"
	// votes: []
	// votesAgainst: "0"
	// votesFor: "0"
*/
const Provider = 
	({
		children
	}) => {

		const [proposals, setProposals] = useState([])
		const { files, hydrate } = useFileStorage()
		const { vote } = useDao()

		const { 
			data, 
			error, 
			loading,
			refetch
		} = useQuery(ALL_PROPOSALS)

 		// need to merge proposal data and file data whenever they change
 		useEffect(() => {
 			const _proposals = (data?.proposals||[]).map(proposal => {
 				// either open or expired, requires timestamp check
 				const state = calculateProposalState(proposal)

				const ipfsValues = files[proposal?.id]||{}
				 
 				return {
 					...proposal,
 					...state,
 					...ipfsValues,
 					castVote: (inFavor=1, amount="1000000000000000000") => vote(proposal?.id, `${inFavor}`, `${amount}`),
 				}
 			})
  			setProposals(_proposals)
 		}, [data?.proposals, files, vote])

		return <Context.Provider 
			value={{
				loading,
				proposals,
				error,
				refetch: () => {
					hydrate()
					refetch()
				}
			}}
			>
			{children}
		</Context.Provider>
	};

export default {
	Provider,
	useProposals,
	useProposal
}