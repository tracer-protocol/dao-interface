import { useState, createContext, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid';
import Notification from 'components/Notification'

const Context = createContext({});

const useTransactions = () => {
	const { transactions, createTransaction } = useContext(Context)

	return {
		transactions,
		createTransaction
	}
}

class Transaction{

	constructor(contract, method, onUpdateCallback){
		this.statusOpts = {
			INITIALIZED: 'INITIALIZED',
			PROCESSING: 'PROCESSING',
			ERROR: 'ERROR',
			SUCCESS: 'SUCCESS',
		}
		this.id = uuidv4()
		this._onSuccess = () => {}
		this._onFailure = () => {}
		this._params = []
		this._status = this.statusOpts.INITIALIZED
		this._message = ""
		this._receipt = ""
		this.notification = ""
		this._attemptMessage = 'Transaction Processing'
		this._successMessage = 'Transaction Success'
		this._failureMessage = 'Transaction Failed'

		this.contract = contract
		this.method = method
		this.onUpdateCallback = onUpdateCallback
		this.triggerUpdate()
	}

	set params(val){
		this._params = val
	}

	set attemptMessage(val){
		this._attemptMessage = val
	}

	set successMessage(val){
		this._successMessage = val
	}

	set failureMessage(val){
		this._failureMessage = val
	}

	set onSuccess(cb){
		this._onSuccess = cb
	}

	set onFailure(cb){
		this._onFailure = cb
	}

	set status(status){
		this._status = status
		this.triggerUpdate()
	}

	set message(val){
		this._message = val
		this.triggerUpdate()
	}

	set receipt(val){
		this._receipt = val
		this.triggerUpdate()
	}

	async send(params){
		try {
			this.notification = Notification.processing({title: this._attemptMessage, duration: -1})

			const tx = this.contract.methods[this.method](...this._params)
			await tx.call(params)

			this.status = this.statusOpts.PROCESSING
			this.receipt = await tx.send(params)
			
			this.status = this.statusOpts.SUCCESS
			this.notification && this.notification.success(this._successMessage)

			const returnObj = this.constructReturnObject()
			this._onSuccess(returnObj)
		} catch(e) {
			console.error(e)
			this.message = e.message
			this.status = this.statusOpts.ERROR
			
			// if user aborted
			if(e.message === 'MetaMask Tx Signature: User denied transaction signature.'){
				this.notification && this.notification.warning('Transaction aborted')
			}

			else if(e.message.includes('execution reverted: DAO: Caller not staked')){
				this.notification && this.notification.warning('You are not staked')
			}

			// if other error
			else{
				this.notification && this.notification.error(this._failureMessage)
				const returnObj = this.constructReturnObject()
				this._onFailure(returnObj)
			}
			
		}
	}

	constructReturnObject(){
		return {
			id: this.id,
			status: this._status,
			message: this._message,
			receipt: this._receipt,
			notification: this.notification
		}
	}

	triggerUpdate(){
		const returnObj = this.constructReturnObject()
		this.onUpdateCallback(returnObj)
	}
}

const Provider = ({children}) => {
	
	// todo: Redux useReducer
	const [transactions, setTransactions] = useState([])

	const handleUpdateTx = tx => {
		setTransactions(txs => { 
			txs[tx.id] = tx 
			return txs
		})
	}

	return <Context.Provider 
		value={{
			createTransaction: (contract, method) => new Transaction(contract, method, handleUpdateTx),
			transactions
		}}
		>
		{children}
	</Context.Provider>
}

export default {
	Provider,
	useTransactions
}