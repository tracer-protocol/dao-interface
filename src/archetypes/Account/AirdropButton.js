import React, { useState } from 'react';
import styled from 'styled-components'
import { useAccount } from '@libs/web3'
import { useAirdrop } from '@libs/tracer';
import { Button } from '@components'
import { add } from '@components/Notification';
import { Spinner } from '@components/DataLoader';

const SSpinner = styled(Spinner)
`
	margin: auto;
	color: #0000bd;
	opacity: 1;
	> svg {
		width: 2rem;
		height: 2rem;
	}
`

export default styled(
	({
		className
	}) => {
		const [ loading, setLoading ] = useState(false);
		const { status } = useAccount()
		const { generateProof, withdraw, claimed } = useAirdrop();

		const getProof = async (e) => {
			e.preventDefault();
			setLoading(true);
			if (claimed) {
				add('ERROR', {
					title: 'Failed to claim: Account has already claimed',
				})
				setLoading(false);
				return;
			}
			//if proof exists, then submit proof on chain
			const proof = generateProof();
			if (!proof.error) {
				await withdraw(proof.proofData, proof.amount)
			} else {
				add('ERROR', {
					title: 'Failed to claim: Connected account has no valid claims',
				})
			}
			setLoading(false);
		}
        
		return status === 'CONNECTED'
			? 	<Button 
					type='primary'
					className={`account-button -connected ${className}`}
					onClick={getProof}
					>

						{loading 
							? <SSpinner />
							: claimed 
								? 'Airdrop claimed'
								: 'Claim airdrop'
						}
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
		min-width: 10rem;
		text-align: center;
	`