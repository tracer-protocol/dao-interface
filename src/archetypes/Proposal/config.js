export const statusOptions = {
	proposed: {
		key: 'proposed',
		value: 'Recently Proposed',
		color: '#C7EBFF',
		text: '#000'
	},
	open: {
		key: 'open',
		value: 'Open',
		color: '#83ADFE',
	},
	pending: {
		key: 'pending',
		value: 'Pending',
		color: '#4848ED',
	},
	complete: {
		key: 'complete',
		value: 'Complete',
		color: '#0000bd',
	}
}


// transfer (recipient, amount)
export const proposalFunctions = {
	setVestingSchedule: {
		key: 'setVestingSchedule',
		inputs: [
			{
				key: 'account',
				label: 'Receiver address',
				type: 'address',
				name: 'account'
			}, {
				key: 'amount',
				label: "Vested amount (TCR tokens)",
				type: 'uint256',
				toWei: true,
				name: "amount",
			}, {
				key: 'cliffWeeks',
				label: 'Number of Weeks till vesting cliff',
				type: 'uint256',
				name: 'cliffWeeks'
			}, {
				key: 'vestingWeeks',
				label: 'Duration of vesting period (weeks)',
				type: 'uint256',
				name: 'vestingWeeks'
			} 
		]
	},
	transfer: {
		key: 'transfer',
		inputs: [
			{
				key: 'account',
				label: 'Receiver address',
				type: 'address',
				name: 'account'
			}, {
				key: 'currency',
				type: 'currency', // this will be ignored when generating the inputs
				target: true,
				label: 'Desired Currency',
				name: 'currency',
				default: 'dai', 
				options: [ // these options map to defined contract addresses in App.config
					{
						ticker: 'DAI',
						key: 'dai'
					}, {
						ticker: 'TCR',
						key: 'tracerToken'
					}
				]
			} ,{
				key: 'amount',
				label: "Transfer amount",
				type: 'uint256',
				toWei: true,
				name: "amount",
			}, 
		]
	}
}
