import { useQuery, gql } from '@libs/graph';

const TOP_HOLDERS = gql`
	query Members {
		members(first: 4, orderBy: balance, orderDirection: desc) {
			id
			balance
		}
	}
`
const ALL_MEMBERS = gql`
	query Members {
		members {
			id
			staked
			votes{
				id
			}
		}
	}
`

const useMembers = () => {
	const { 
		data, 
		error, 
		loading,
		refetch
	} = useQuery(ALL_MEMBERS)

	return {
		members: data?.members||[],
		error,
		loading,
		refetch,
	}
}

const useTopHolders = () => {
	const { 
		data, 
		error, 
		loading,
		refetch
	} = useQuery(TOP_HOLDERS)

	return {
		topHolders: data?.members || [],
		error,
		loading,
		refetch,
	}
}


export default {
	useMembers, useTopHolders
}