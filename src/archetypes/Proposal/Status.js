import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import { Statistic, Typography, Button as AButton, Row, Form, Modal, Input } from 'antd';
import moment from 'moment'
import { upperFirst } from 'lodash'
import { Tag, Button as StakeButton, Max, Button } from '@components'
import { numberToMaxDb, fromWei } from '@util/helpers'
import { useProposal, useProposals, useDao, useTracer } from '@libs/tracer'
import { Link } from 'react-router-dom';
import { useAccount } from '@libs/web3';
import Web3 from 'web3';
import { statusOptions } from './config'
import { Account } from '@archetypes'

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
					title={`${upperFirst(status === 'proposed' ? 'pending' : status)}`}
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
 				background: statusOptions[state]?.color,
 				color: `${statusOptions[state]?.text}`
 			}}
 			>
 			{statusOptions[state]?.value}
 		</Tag>
	})
	`
		border: none !important;
		border-radius: 1em;
		// color: #fff;
	`

const VoteForm = styled(Form)
`
	padding-top: 3rem;
	padding-right: 3rem;
	padding-left: 3rem;
	display: flex;
	flex-direction: column;
	align-items: center;

	.amount {
		margin-bottom: 4rem;
	}

	.submit {
		margin-bottom: 0;
	}
`

const VoteModal = styled(Modal)
`
	border-radius: 10px;
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
			totalStaked
		} = useProposal(id)

		const formRef = React.createRef()

		const {
			vote, quorumDivisor, userStaked
		} = useDao()

		const { status } = useAccount();

		const [percent, setPercent] = useState(0);
		const [showModal, setShowModal] = useState(false);

		const inputMax = (e) => {
			e.preventDefault();
			if (userStaked) { // user has no stake
				formRef.current.setFieldsValue({ amount: Web3.utils.fromWei(userStaked)})
			}
		}

		const checkValidAmount = (_rule, value, callback) => {
			const amount = parseFloat(value);
			const balance = parseFloat(Web3.utils.fromWei(userStaked));
			if(amount <= balance) {
				return callback()
			} else if (!amount) {
				return callback("Amount is required")
			}
			return callback("You have not staked enough to vote this amount")
		};


		useEffect(() => {
			if(!votes?.length) return
			if (state === 'complete' && fromWei(votesFor) === '0' && yes) {
				// HACKY ADD FOR SNAPSHOT PROPOSALS
				setPercent(52); return;
			}
			if (!totalStaked) return;
			setPercent(100 / fromWei(totalStaked) * (yes ? fromWei(votesFor) : fromWei(votesAgainst)))
		}, [votes, totalStaked]) // eslint-disable-line

		return <div
			className={`widgetbar ${className}`}
			>

			<VoteModal visible={showModal} footer={null} onCancel={() => setShowModal(false)} >
				<VoteForm
					onFinish={(values) => {
						// true boolean of yes
						vote(id, !!yes, Web3.utils.toWei(values.amount));
					}}
					ref={formRef}
				>
					<Form.Item
						label="Amount to Vote"
						name="amount"
						className="amount"
						onChange={(e) => {e.preventDefault(); formRef.current.validateFields(['amount']);}}
						required={false}
						rules={[
							{
								validator: checkValidAmount
							}
						]}
						>
						<Input type="number"
							addonAfter={
								<Max
									onClick={inputMax}
								>
									Max
								</Max>
							}

						/>
					</Form.Item>

					<Form.Item className="submit">
					{
						status !== 'CONNECTED'
						?
							<Account.Button className="button"/>
						:
							<Button
								size='large'
								type="primary"
								className="button"
								htmlType="submit"

								>
									Submit Vote
							</Button>
					}
					</Form.Item>

					</VoteForm>
			</VoteModal>
			<Typography.Text className='title'>
				{!!yes && 'Yes'} {!!no && 'No'} {numberToMaxDb(percent, 1)}% ({!yes 
					? fromWei(votesAgainst) 
					: state === 'complete' && fromWei(votesFor) === '0' // Hacky add for snapshot proposals
						? 17
						: fromWei(votesFor)
					})
			</Typography.Text>
			<span className="chart">
				<span className='progress' style={{width: `${percent}%`}}/>
				<span className='marker' style={{left: `${100 / quorumDivisor}%`}}/>
			</span>
			{buttons &&
				<AButton
					disabled={['pending', 'complete', 'proposed'].includes(state)}
					className='button'
					size='small'
					onClick={() =>
						{
							if (!['pending', 'complete', 'proposed'].includes(state)) setShowModal(true);
						}
					}
					>
					Vote {yes ? 'Yes' : 'No'}
				</AButton>
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
		const { userStaked } = useDao()

		const {
			userBalance
		} = useTracer();

		const { status } = useAccount();

		return <div
			className={className}
			>

			<div className='title'>
				<a href='https://vote.tracer.finance/' target='_blank' rel="noreferrer noopener"><Button size='large' type='primary'>Vote On Snapshot</Button></a>
			</div>

			<Row  justify="center">
				{
					status === 'CONNECTED' &&
					parseInt(fromWei(userBalance)) >= 1 &&
					parseInt(fromWei(userStaked)) === 0 &&
						<Link to="/dashboard">
							<StakeButton
								type="primary"
								className="stake"
								onClick={() => null}
								>
								Stake
							</StakeButton>

						</Link>
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
