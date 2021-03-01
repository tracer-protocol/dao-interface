import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { createNetworkStatusNotifier } from 'react-apollo-network-status';

const { link, useApolloNetworkStatus } = createNetworkStatusNotifier();

const useGlobalLoadingState = 
	() => {
		const status = useApolloNetworkStatus();
		return status.numPendingQueries + status.numPendingMutations > 0
	}

const ApolloWrapper = uri => new ApolloClient({
	link: link.concat(createHttpLink({uri: uri})),
	cache: new InMemoryCache(),
});

export default {
	ApolloWrapper,
	useGlobalLoadingState
}