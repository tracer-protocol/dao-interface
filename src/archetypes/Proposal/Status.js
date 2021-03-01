import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import { Statistic, Typography, Button, Row } from 'antd';
import moment from 'moment'
import { upperFirst } from 'lodash'
import { Tag, Button as StakeButton } from '@components'
import { numberToMaxDb, fromWei } from '@util/helpers'
import { useProposal, useProposals, useDao, useTracer } from '@libs/tracer'
import { useAccount } from '@libs/web3';
import { statusOptions } from './config'

const Info = styled(
	({
		id,
		className
	}) => {
		const { state, status, timestamps } = useProposal(id)
		const { refetch } = useProposals()

		switch (state) {
			case 'proposed':
				return <Statistic.Countdown
					className={`proposal-status-info ${className}`}
					title="Starts in"
					value={moment.unix(timestamps?.open)}
					onFinish={refetch}
				/>
			case 'open':
				return <Statistic.Countdown
					className={`proposal-status-info ${className}`}
					title="Remaining"
					value={moment.unix(timestamps?.closed)}
					onFinish={refetch}
				/>
			case 'processing':
				return <Statistic
					className={`proposal-status-info ${className} status-${status}`}
					title={`${upperFirst(status === 'proposed' ? 'processing' : status)}`}
					value={moment.unix(timestamps?.closed).format('DD-MM-YYYY')}
					data-status={status}
				/>
			case 'complete':
				return <Statistic
					className={`proposal-status-info ${className} status-${status}`}
					title={`${upperFirst(status === 'proposed' ? 'complete' : status)}`}
					value={moment.unix(timestamps?.complete).format('DD-MM-YYYY')}
					data-status={status}
				/>
			default:
				return null
		}
	})
	`
		>*{
			line-height: 1em;
		}

		.ant-statistic-title{
			font-size: 1.2rem;
			margin-bottom: 2px;
		}

		.ant-statistic-content{
			font-size: 1.8rem;
		}


		&.disabled{
			opacity: 0.5;
			cursor: not-allowed;
		}

		&.status-passed .ant-statistic-title{
			color: green
		}

		&.status-rejected .ant-statistic-title{
			color: red
		}
	`

const State = styled(
	({
		id,
		className
	}) => {
		const { state } = useProposal(id)

		return <Tag 
 			className={className} 
 			style={{
 				background: statusOptions[state]?.color
 			}}
 			>
 			{statusOptions[state]?.value}
 		</Tag>
	})
	`
		border: none !important;
		border-radius: 1em;
		color: black !important;
	`

const WidgetBar = styled(
	({
		id,
		yes,
		no,
		buttons,
		className
	}) => {

		const { 
			state,
			votes,
			votesAgainst,
			votesFor,
			threshold,
		} = useProposal(id)

		const { 
			totalStaked, vote
		} = useDao()

		const [percent, setPercent] = useState(0)

		useEffect(() => {
			if(!votes?.length || !totalStaked) return
			setPercent(100 / fromWei(totalStaked) * (yes ? fromWei(votesFor) : fromWei(votesAgainst)))
		}, [votes, totalStaked]) // eslint-disable-line

		return <div
			className={`widgetbar ${className}`}
			>
			<Typography.Text className='title'>
				{!!yes && 'Yes'} {!!no && 'No'} {numberToMaxDb(percent, 1)}% ({yes ? fromWei(votesFor) : fromWei(votesAgainst)})
			</Typography.Text>
			<span className="chart">
				<span className='progress' style={{width: `${percent}%`}}/>
				<span className='marker' style={{left: `${fromWei(threshold)}%`}}/>
			</span>
			{buttons && 
				<Button 
					disabled={['processing', 'complete', 'proposed'].includes(state)}
					className='button' 
					size='small' 
					onClick={() => 
						yes 
							? vote(id, true, "1000000000000000000") 
							: vote(id, false, "1000000000000000000") 
					}
					>
					Vote {yes ? 'Yes' : 'No'}
				</Button>
			}

			

		</div>
	})
	`
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;


	.title{
		display: block;
		margin-right: 1em;
	}
	
	.chart{
		display: block;
		background: rgba(0,0,0,0.1);
		height: 1.6rem;
		position: relative;
		border-radius: 0.8em;
		width: 28rem;

		.marker{
			content: '';
			position: absolute;
			top: 50%;
			height: 2rem;
			width: 1px;
			background: black;
			transform: translateY(-50%);
		}

		.progress{
			position: absolute;
			top: 0;
			height: 1.6rem;
			width: 42%;
			background: ${({yes, no}) => !!yes ? 'lightgreen' : !!no ? 'pink' : 'rgba(0,0,0,0.1)'};
			left: 0;
			border-radius: 0.8em 0 0 0.8em;
		}
	}

	.button{
		display: block;
		margin-left: 1em;
	}

	`

const VotingWidget = ({className, ...rest}) =>
	<div
		className={`state-graph ${className}`}
		>
		<WidgetBar {...rest} yes/>
		<WidgetBar {...rest} no/>
	</div>

const Panel = styled(
	({
		id,
		className,
	}) => {
		const { 
			__STAKE
		} = useDao()

		const { 
			userBalance 
		} = useTracer();


		const { status } = useAccount();

		const { threshold } = useProposal(id)

		return <div
			className={className}
			>
			<div className='status'>
				<Info id={id}/>
				<State id={id}/>
			</div>
			
			<div className="title">
				<Typography.Text>Votes</Typography.Text>
				<Typography.Text disabled>{fromWei(threshold)}% Required</Typography.Text>
			</div>
			
			<VotingWidget id={id} buttons/>

			<Row  justify="center">
				{
					status === 'CONNECTED' &&
					parseInt(fromWei(userBalance)) >= 1 &&
						<StakeButton
							type="primary"
							className="stake"
							onClick={__STAKE}
							>
							Stake
						</StakeButton>
				}
			</Row>

		</div>
	})
	`
		.status{
			display: flex;
			align-items: center;
			justify-content: space-between;

			&:first-child{
				text-align: left;
			}
			
			&:last-child{
				text-align: right;
			}

			.ant-statistic-content{
				font-size: 2.4rem;
			}
		}

		>.title{
			margin: 1.7em 0 1em 0;
			display: block;
			text-align: center;

			>.ant-typography{
				display: block;
				text-align: center;
			}
		}

		.stake{
			margin-top: 2rem;
		}

		.widgetbar{
			>.title{
				width: 10rem;
				white-space: nowrap;
			}

			>.chart{
				width: calc(100% - 20rem);
			}

			>.button{
				width: 10rem;
			}

			& + .widgetbar{
				margin-top: 0.5em;
			}
		}
	`

export default {
	Info,
	State,
	VotingWidget,
	Panel
}