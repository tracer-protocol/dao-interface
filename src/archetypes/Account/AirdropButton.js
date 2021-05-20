import React, { useState } from 'react';
import styled from 'styled-components'
import { useAccount } from '@libs/web3'
import { useAirdrop } from '@libs/tracer';
import { Button } from '@components'
import { add } from '@components/Notification';
import { Spinner } from '@components/DataLoader';
import ParticipationAgreement from '@components/ParticipationAgreement';
import { Modal, Checkbox } from 'antd';

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

const SCheckbox = styled(Checkbox)
`
	margin: 10px 0;
`
const Wrap = styled.div
`
	margin: auto;
	width: 25%;
`

export default styled(
	({
		className
	}) => {
		const [ loading, setLoading ] = useState(false);
		const [ showModal, setShowModal ] = useState(false);
		const [ agree, setAgree ] = useState(false);
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
			? 	
				<>
				<Button 
					type='inverse'
					className={`account-button -connected ${className}`}
					onClick={(e) => { e.preventDefault(); !claimed && setShowModal(true) }}
					>

						{loading 
							? <SSpinner />
							: claimed 
								? 'Claimed'
								: 'Claim '
						}
				</Button>
				<Modal title="Participation Agreement" visible={showModal} onCancel={() => { setShowModal(false)}} 
					footer={[
						<Wrap>
						<Button 
							type='primary'
							disabled={!agree}
							className={`-connected ${className}`}
							onClick={getProof}
							>

								{loading 
									? <SSpinner />
									: claimed 
										? 'Claimed'
										: 'Claim'
								}
						</Button>
						</Wrap>
					]}
				>
					<ParticipationAgreement />
					<SCheckbox onChange={(e) => setAgree(e.target.checked)}>YOU HAVE READ, FULLY UNDERSTOOD, AND ACCEPT THIS DISCLAIMER AND ALL THE TERMS CONTAINED IN THE PARTICIPATION AGREEMENT</SCheckbox>
				</Modal>
				</>
			: 	null
	})
	`
		display: flex;
		align-items: center;
		justify-content: center;
		>.paper{
			margin-right: 0.5em !important;
		}
        margin-right: 1vw;
		color: black;
		min-width: 10rem;
		text-align: center;
	`
