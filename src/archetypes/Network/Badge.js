import React from 'react';
import styled from 'styled-components'
import { Tag } from 'antd';
import { useNetwork } from '@libs/web3'

export default styled(
	({
		className
	}) => {
		const { name, id } = useNetwork()

		return !id || id === 1
			? null 
			: <Tag className={className}>{name.toUpperCase()}</Tag>		
	})
	`
		background-color: var(--color-gold);
		border: none;
		color: black
	`