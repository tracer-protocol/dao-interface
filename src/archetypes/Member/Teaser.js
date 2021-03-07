import React from 'react';
import styled from 'styled-components'
import { Typography, Statistic } from 'antd'
import { useProposals } from '@libs/tracer'
import { truncateString, fromWei, numberToMaxDb } from '@util/helpers'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

export default styled(
	({
		id, 
		staked,
		votes=[],
		className
	}) => {

		const { proposals } = useProposals({creator: id})
		return <div 
			className={`proposal-teaser ${className}`}
			>
			<Typography.Title 
				level={1}
				ellipsis 
				className='title'
				>
				<Jazzicon 
					diameter={20} 
					seed={jsNumberForAddress(id)}
				/>
				{truncateString(id)}
			</Typography.Title>
			<Statistic
				title="Tokens Staked" 
				value={numberToMaxDb(fromWei(staked), 5)} 
			/>
			<Statistic
				title="Proposals raised" 
				value={proposals.length} 
			/>
			<Statistic
				title="Votes Cast" 
				value={votes.length} 
			/>
		</div>
	})
	`
		padding: 1.7rem 2em;
		background: white;
		display: flex;
		align-items: center;
		justify-content: space-between;

		>*{
			width: 25%;
		}

		.title{
			margin: 0;
			margin-right: 1em;
			font-size: 1.8rem;
			font-weight: normal;
			display: flex;
			align-items: center;

			*:first-child{
				margin-right: 0.5rem !important;
			}

		}

		.ant-statistic{
			.ant-statistic-content{
				font-size: 1.6rem;
			}
		}
	`