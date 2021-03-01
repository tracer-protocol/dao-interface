import React from 'react';
import styled from 'styled-components'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { truncateString } from '@util/helpers'


export default styled(
	({
		address='',
		className
	}) => {
		return <span className={`address ${className}`}>
			<Jazzicon diameter={24} seed={jsNumberForAddress(address)}/>
			<span className="address-truncated">{truncateString(address)}</span>
		</span>
	})
	`
		display: flex;
		align-items: center;
		.address-truncated{ margin-left: 0.5em }
	`