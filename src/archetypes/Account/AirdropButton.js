import React from 'react';
import styled from 'styled-components'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useAccount } from '@libs/web3'
import { Button } from '@components'
import { truncateString } from '@util/helpers'

const getProof = () => {
    console.log("Fetching you a proof")

    //make API request to microservice to get proof

    //if proof exists, show a popup to submit proof on chain
}

export default styled(
	({
		className
	}) => {
		const { status, connect, disconnect, address } = useAccount()
        
		return status === 'CONNECTED'
			? 	<Button 
					type='primary'
					className={`account-button -connected ${className}`}
					onClick={getProof}
					>
					Claim Airdrop
				</Button>
			: 	null
	})
	`
		display: flex;
		align-items: center;
		>.paper{
			margin-right: 0.5em !important;
		}
        margin-right: 1vw;
		color: black;
	`