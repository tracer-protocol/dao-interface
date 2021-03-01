import { useEffect, useState, createContext, useContext } from 'react'
import { get } from 'lodash'
import { useNetwork, useAccount, useTransactions } from '@libs/web3'
import { useTracer } from '@libs/tracer'
import { TRACER_DAO_ABI } from './_config'
import { useFileStorage, useProposals } from './'
import { proposalFunctions } from '@archetypes/Proposal/config';

const Context = createContext({});

const useContract = () => useContext(Context)

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
		let [proposalThreshold, setProposalThreshold] = useState()
		let [userStaked, setUserStaked] = useState('0')
		let [totalStaked, setTotalStaked] = useState('0')

		useEffect(() => {
			if(contractAddresses?.tracerDao && web3){
				const _contract = new web3.eth.Contract(TRACER_DAO_ABI, contractAddresses?.tracerDao)
				setContract(_contract)
			}
		}, [contractAddresses?.tracerDao]) // eslint-disable-line


		const fetchContractFields = async () => {
			const threshold = await contract.methods.proposalThreshold().call()
			setProposalThreshold(threshold)

			const staked = await contract.methods.totalStaked().call()
			setTotalStaked(staked)
		}

		const fetchUserStaked = async () => {
			const staked = await contract.methods.getStaked(address).call()
			setUserStaked(staked)
		}

		// NOTE TO DEV: USE THIS TO STAKE IN TRACER DAO
		// For now these will just be deposit and withdraw 1
		const __STAKE = async (amount) => {
			await __APPROVE()
			if(!address || !contract) {
				console.log('Address or Contract not defined')
			}else{
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
				console.log('Address or Contract not defined')
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

		let propose = async proposalFields => {
			if(!address || !contract) return
			
			const inputValues = [], inputs = [];
			for (let input of proposalFunctions[proposalFields.function_call].inputs) {
				let val = proposalFields[input.key];
				inputValues.push(input.toWei ? web3.utils.toWei(val) : val)
				inputs.push({
					type: input.type,
					name: input.name
				}) 
			}

			// Proper way to do it
			const vestingProposalData = web3.eth.abi.encodeFunctionCall(
				{
					name: `${proposalFields.function_call}`,
					type: "function",
					inputs: inputs
				}, inputValues
			)

			const { vestingContract } = contractAddresses;

			const transferPropsalData = web3.eth.abi.encodeFunctionCall(
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


			// const proposalData = web3.eth.abi.encodeFunctionCall(
			// 	{
			// 		name: `${proposalFields.function_call}`,
			// 		type: "function",
			// 		inputs: [
			// 			{
			// 			    type: "address",
			// 			    name: "receiver",
			// 			},
			// 		],
			// 	}, [address]
			// )

			// This automatically adds a transfer to the vesting contract of the required amount
			const tx = createTransaction(contract, 'propose')
			tx.params = [[proposalFields.account, vestingContract], [vestingProposalData, transferPropsalData]]
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
				proposalThreshold,
				userStaked,
				totalStaked,
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