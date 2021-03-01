import Network from './network.js'
import Account from './account.js'
import Transaction from './transaction'

// nested providers
export const Web3Provider = ({networkConfig, children}) => {
	return <Network.Provider config={networkConfig}>
		<Account.Provider>
			<Transaction.Provider>
				{children}
			</Transaction.Provider>	
		</Account.Provider>	
	</Network.Provider>
}

// public hooks
export const useNetwork = Network.useNetwork
export const useAccount = Account.useAccount
export const useTransactions = Transaction.useTransactions