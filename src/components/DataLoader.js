import React from 'react';
import styled from 'styled-components'
import { Result } from 'antd'
import { LoadingOutlined, MehOutlined } from '@ant-design/icons';


const NoData = styled(
	({
		className	
	}) => 
	<Result
		title="No Results found"
		icon={<MehOutlined className={className} />}
		subTitle={`Looks like there's nothing here`}
	/>
)`color: var(--color-primary)!important;`


const Spinner = styled(
	({
		className
	}) => 
		<LoadingOutlined className={className}/> 
	)`
		opacity: 0.3;

		svg{
			width: 3rem;
			height: 3rem;
		}
	`

export default 
	({
		loading=false,
		noresults=false,
		children,
	}) => !!loading 
		? <Spinner/>
		: !!noresults
			? <NoData/>
			: children

