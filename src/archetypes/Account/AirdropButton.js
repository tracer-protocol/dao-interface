import React, { useState } from 'react';
import styled from 'styled-components'
import { useAccount } from '@libs/web3'
import { useAirdrop } from '@libs/tracer';
import { Button } from '@components'


export default styled(
	({
		className
	}) => {
		const [ loading, setLoading ] = useState(false);
		const { status } = useAccount()
		const { generateProof, withdraw } = useAirdrop();

		const getProof = async (e) => {
			e.preventDefault();
			setLoading(true);
			//if proof exists, then submit proof on chain
			const proof = generateProof();
			console.debug(proof);
			if (!proof.error) {
				withdraw(proof.proofData, proof.amount)
			}
		}
        
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