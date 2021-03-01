export const statusOptions = {
	proposed: {
		key: 'proposed',
		value: 'Warming Up',
		color: '#e6f9ff',
	},
	open: {
		key: 'open',
		value: 'Open',
		color: '#ccffcc',
	},
	pending: {
		key: 'pending',
		value: 'Pending',
		color: '#E9A9FF',
	},
	complete: {
		key: 'complete',
		value: 'Complete',
		color: '#46B1FF',
	}
}


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
				name: 'cliffWeeks'
			} 
		]
	}
}
