import Proposal from './proposal'
import Members from './members'
import Filestorage from './filestorage'
import DAOContract from './contract.dao'
import TokenContract from './contract.token'
import KnownAddresses from './dao.addresses.json';
import { useNetwork } from '../web3'

// nested providers
export const TracerProvider = ({mapEndpoint, children}) => {

	const { daoMapUrl } = useNetwork();

	return (
		<Filestorage.Provider 
			url={daoMapUrl}
			>
			<Proposal.Provider>
				<TokenContract.Provider>
					<DAOContract.Provider>
						{children}
					</DAOContract.Provider>
				</TokenContract.Provider>
			</Proposal.Provider>
		</Filestorage.Provider>
	)
}
	

// public hooks
export const useProposals = Proposal.useProposals
export const useProposal = Proposal.useProposal
export const useProposalState = Proposal.useProposalState
export const useMembers = Members.useMembers
export const useTopHolders = Members.useTopHolders
export const useFileStorage = Filestorage.useFileStorage
export const useDao = DAOContract.useContract
export const useTracer = TokenContract.useContract

export { KnownAddresses };