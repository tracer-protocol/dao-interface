import { truncateString } from 'util/helpers'

import Button from 'components/Button'
import { useAccount } from 'libs/web3'
import React from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled from 'styled-components'

export default styled(({ className }) => {
	const { status, connect, disconnect, address } = useAccount()

	return status === 'CONNECTED' ? (
		<Button className={`account-button -connected ${className}`} size="large" onClick={disconnect}>
			<Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
			{truncateString(address)}
		</Button>
	) : (
		<Button className={`account-button -disconnected ${className}`} size="large" onClick={connect}>
			Connect Wallet
		</Button>
	)
})`
	display: flex;
	align-items: center;
	> .paper {
		margin-right: 0.5em !important;
	}
`
