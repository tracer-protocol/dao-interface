import { useEffect, useState, createContext, useContext, useReducer } from 'react'
import { get } from 'lodash'
import { useNetwork, useAccount, useTransactions } from '@libs/web3'
import { useTracer } from '@libs/tracer'
import { TRACER_DAO_ABI } from './_config'
import { useFileStorage, useProposals } from './'
import { proposalFunctions } from '@archetypes/Proposal/config';

const Context = createContext({});

const useContract = () => useContext(Context);



const Provider = 
	({
		children
	}) => {

		let { contractAddresses, web3 } = useNetwork()
		let { address } = useAccount()
		let { fetchBalance, __APPROVE } = useTracer();
		const { createTransaction } = useTransactions()
		const { upload } = useFileStorage()
		const { refetch } = useProposals()

		let [contract, setContract] = useState()

		const initialState = {
			totalStaked: 0,
			userStaked: 0,
			proposalThreshold: 0,
			quorumDivisor: 0
		}
		const reducer = (state, action) => {
			switch (action.type) {
				case 'setTotalStaked':
					return {
						...state, totalStaked: action.value
					};
				case 'setUserStaked':
					return {
						...state, userStaked: action.value
					};
				case 'setProposalThreshold':
					return {
						...state, proposalThreshold: action.value
					};
				case 'setQuorumDivisor':
					return {
						...state, quorumDivisor: action.value
					};
				default:
				throw new Error();
			}
		}

		const [state, dispatch] = useReducer(reducer, initialState);

		useEffect(() => {
			if(contractAddresses?.tracerDao && web3){
				const _contract = new web3.eth.Contract(TRACER_DAO_ABI, contractAddresses?.tracerDao)
				setContract(_contract)
			}
		}, [contractAddresses?.tracerDao]) // eslint-disable-line


		const fetchContractFields = async () => {
			const threshold = await contract.methods.proposalThreshold().call()
			dispatch({ type: 'setProposalThreshold', value: threshold })
			
			const quorumDivisor = await contract.methods.quorumDivisor().call()
			dispatch({ type: 'setQuorumDivisor', value: quorumDivisor})

			const staked = await contract.methods.totalStaked().call()
			dispatch({ type: 'setTotalStaked', value: staked })
		}

		const fetchUserStaked = async () => {
			const staked = await contract.methods.getStaked(address).call()
			dispatch({ type: 'setUserStaked', value: staked })
		}

		// NOTE TO DEV: USE THIS TO STAKE IN TRACER DAO
		// For now these will just be deposit and withdraw 1
		const __STAKE = async (amount) => {
			await __APPROVE()
			if(!address || !contract) {
				console.debug('Address or Contract not defined')
			}else {
				const tx = createTransaction(contract, 'stake')
				tx.params = [amount]
				tx.attemptMessage = 'Staking TCR'
				tx.successMessage = 'Staking successful'
				tx.failureMessage = 'Failed to stake'
				await tx.send({from: address})

				fetchUserStaked();
				fetchContractFields();
				fetchBalance();
			}
		}

		const __WITHDRAW = async (amount) => {
			if(!address || !contract) {
				console.debug('Address or Contract not defined')
			} else {
				const tx = createTransaction(contract, 'withdraw')
				tx.params = [amount]
				tx.attemptMessage = 'Withdrawing TCR'
				tx.successMessage = 'Withdrawing successful'
				tx.failureMessage = 'Failed to withdraw'
				await tx.send({from: address})

				fetchUserStaked()
				fetchContractFields();
				fetchBalance();
			}
		}

		const vote = (proposalId, userVote, amount) => {
			if(!address || !contract) return
			const tx = createTransaction(contract, 'vote')
			tx.params = [proposalId, userVote, amount]
			tx.attemptMessage = 'Voting'
			tx.successMessage = 'Voting success'
			tx.failureMessage = 'Voting failed'
			tx.send({ from: address })
		}

		const buildProposal = (proposalFields) => {
			const inputValues = [], inputs = [];
			// generate inputs for encoded function call
			// this is generic, will fetch all inputs based on the inputed form
			// will ignore any inputs that have the type of target as these dont belong in the function call
			// this is generic for all proposal functions
			for (let input of proposalFunctions[proposalFields.function_call].inputs) {
				let val = proposalFields[input.key];
				if (input.target) continue; // ignore the inputs which are related to target selection
				inputValues.push(input.toWei ? web3.utils.toWei(val) : val)
				inputs.push({
					type: input.type,
					name: input.name
				}) 
			}

			const functionData = web3.eth.abi.encodeFunctionCall(
				{
					name: `${proposalFields.function_call}`,
					type: "function",
					inputs: inputs
				}, inputValues
			)

			// This automatically adds a transfer to the vesting contract of the required amount
			const { vestingContract, tracerToken } = contractAddresses;

			// this is where we add extra function calls, 
			// for example the vesting schedule automaticall adds a transfer call
			// to ensure the vesting contract has the required funds to set create the vesting schedule
			switch (proposalFields.function_call) {
				case 'setVestingSchedule':
					const transferData = web3.eth.abi.encodeFunctionCall(
						{
							name: 'transfer',
							type: 'function',
							inputs: [
								{
									type: 'address',
									name: 'recipient',
								},
								{
									type: 'uint256',
									name: 'amount',
								},
							],
						}, [vestingContract, web3.utils.toWei(proposalFields.amount)]
					)
					return [[proposalFields.account, tracerToken], [functionData, transferData]]
				case 'transfer': 
					return [[proposalFields.currency], [functionData]];
				default:
					return [[],[]] //error
			}
		}

		let propose = async proposalFields => {
			if(!address || !contract) return

			const params = buildProposal(proposalFields);
			
			console.debug(
				"Generated params \n" + 
				`${params}\n`
				`Targets: ${params[0].toString()}\n` + 
				`ProposalData: ${params[1].toString()}` 
			);
			
			const tx = createTransaction(contract, 'propose')
			tx.params = params;
			tx.attemptMessage = 'Creating proposal'
			tx.successMessage = 'Proposal successfully created'
			tx.failureMessage = 'Proposal creation failed'

			tx.onSuccess = async ({receipt, notification}) => {
				notification && notification.processing({title: 'Uploading proposal data', duration: -1})

				const proposalId = get(receipt, 'events.ProposalCreated.returnValues.proposalId')
				await upload(proposalId, proposalFields)

				notification && notification.success('Proposal created')

				refetch()
			}

			tx.send({from: address})
		}

		useEffect(() => contract && fetchContractFields(), [contract]) // eslint-disable-line
		useEffect(() => contract && address && fetchUserStaked(), [contract, address]) // eslint-disable-line

		return <Context.Provider 
			value={{
				vote,
				propose,
				...state,
				__STAKE,
				__WITHDRAW
				// expose more methods here to interact with the contract
			}}
			>
			{children}
		</Context.Provider>
	};

export default {
	Provider,
	useContract
}